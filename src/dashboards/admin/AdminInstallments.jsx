import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Card, Form, InputGroup, Alert, Spinner, Collapse } from 'react-bootstrap';
import { installmentService } from '../../services/installmentService';
import '../shared/Installments.css';

const AdminInstallments = () => {
    const [plans, setPlans] = useState([]);
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [expandedPlanId, setExpandedPlanId] = useState(null);

    useEffect(() => {
        fetchPlans();
        fetchSummary();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await installmentService.getPlans();
            if (response.success) {
                setPlans(response.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch plans');
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            setSummaryLoading(true);
            const response = await installmentService.getUpcomingSummary();
            if (response.success) {
                setSummary(response.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleRecordPayment = async (planId, amount) => {
        if (!confirm(`Record payment of $${amount}?`)) return;
        try {
            setActionLoading(true);
            const response = await installmentService.recordPayment({
                planId,
                amount: parseFloat(amount)
            });
            if (response.success) {
                alert('Payment Recorded. One item released.');
                fetchPlans();
                fetchSummary();
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkShipped = async (planId, itemIndex) => {
        const tracking = prompt('Enter Tracking Number (Optional):');
        if (tracking === null) return; // Cancelled prompt

        try {
            setActionLoading(true);
            const response = await installmentService.updateReleaseStatus({
                planId,
                itemIndex,
                shipped: true,
                trackingNumber: tracking || ''
            });
            if (response.success) {
                alert('Item marked as shipped');
                fetchPlans();
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredPlans = plans.filter(plan =>
        plan.order?.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleExpand = (id) => {
        setExpandedPlanId(expandedPlanId === id ? null : id);
    };

    return (
        <div className="admin-installments">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Installment Plans Management</h3>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" onClick={fetchSummary} disabled={summaryLoading}>
                        {summaryLoading ? <Spinner animation="border" size="sm" /> : <i className="fas fa-sync-alt me-1"></i>}
                        Refresh Inventory Alerts
                    </Button>
                    <Button variant="primary" onClick={fetchPlans}>Refresh Plans</Button>
                </div>
            </div>

            {/* Upcoming Releases & Low Stock Alerts */}
            <div className="mb-4">
                <Card className="border-warning shadow-sm">
                    <Card.Header className="bg-warning text-dark fw-bold d-flex justify-content-between align-items-center">
                        <span><i className="fas fa-exclamation-triangle me-2"></i>Upcoming Release Inventory Alert</span>
                        <small>Checked against actual BaseSize stock</small>
                    </Card.Header>
                    <Card.Body>
                        {summaryLoading ? <div className="text-center py-3"><Spinner animation="border" size="sm" /></div> : (
                            <div className="table-responsive">
                                <Table size="sm" className="mb-0">
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Base Size</th>
                                            <th>Hair Color</th>
                                            <th className="text-center">Needed Now</th>
                                            <th className="text-center">In Stock</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summary.map((item, idx) => (
                                            <tr key={idx} className={item.isLowStock ? 'table-danger' : ''}>
                                                <td>{item.name}</td>
                                                <td>{item.stockBaseSizeLabel || 'N/A'}</td>
                                                <td>{item.hairColorName || 'None'}</td>
                                                <td className="text-center fw-bold">{item.neededTotal}</td>
                                                <td className="text-center">
                                                    <div>Base: {item.baseAvailableStock !== null && item.baseAvailableStock !== undefined ? item.baseAvailableStock : 'N/A'}</div>
                                                    <div>Color: {item.colorAvailableStock !== null && item.colorAvailableStock !== undefined ? item.colorAvailableStock : 'N/A'}</div>
                                                </td>
                                                <td>
                                                    {item.isLowStock ? (
                                                        <Badge bg="danger">LOW STOCK - REPLENISH!</Badge>
                                                    ) : (
                                                        <Badge bg="success">STOCKED</Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {summary.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-3">No upcoming installment releases tracked.</td></tr>}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>

            <div className="mb-4">
                <InputGroup>
                    <Form.Control
                        placeholder="Search by Order #, Customer Name, or Email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline-primary"><i className="fas fa-search"></i></Button>
                </InputGroup>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? <div className="text-center p-5"><Spinner animation="border" /></div> : (
                <Card className="installment-card border-0 shadow-sm">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th></th>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Plan Details</th>
                                <th>Progress</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPlans.map(plan => (
                                <React.Fragment key={plan._id}>
                                    <tr onClick={() => toggleExpand(plan._id)} style={{ cursor: 'pointer' }}>
                                        <td className="text-center">
                                            <i className={`fas fa-chevron-${expandedPlanId === plan._id ? 'down' : 'right'} text-muted`}></i>
                                        </td>
                                        <td className="fw-bold">{plan.order?.orderNumber}</td>
                                        <td>
                                            <div>{plan.user?.fullName}</div>
                                            <small className="text-muted d-block" style={{ fontSize: '11px' }}>{plan.user?.email}</small>
                                        </td>
                                        <td>
                                            <small className="d-block text-muted">Total: ${plan.totalAmount.toFixed(2)}</small>
                                            <small className="d-block text-muted">Amount due: <strong>${plan.installmentAmount.toFixed(2)}</strong></small>
                                        </td>
                                        <td>
                                            <div style={{ width: '120px' }}>
                                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: '11px' }}>
                                                    <span>{plan.installmentsPaid}/{plan.totalInstallments} paid</span>
                                                    <span>{Math.round((plan.amountPaid / plan.totalAmount) * 100)}%</span>
                                                </div>
                                                <div className="progress" style={{ height: '6px' }}>
                                                    <div
                                                        className="progress-bar bg-success"
                                                        style={{ width: `${(plan.amountPaid / plan.totalAmount) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <Badge bg={
                                                plan.status === 'active' ? 'success' :
                                                    plan.status === 'completed' ? 'primary' :
                                                        plan.status === 'cancelled' ? 'danger' : 'warning'
                                            }>
                                                {plan.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2" onClick={e => e.stopPropagation()}>
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => handleRecordPayment(plan._id, plan.installmentAmount)}
                                                    disabled={actionLoading || (plan.status !== 'active' && plan.status !== 'paused_payment_overdue')}
                                                >
                                                    Pay
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    onClick={() => toggleExpand(plan._id)}
                                                >
                                                    Schedule
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="7" className="p-0 border-0">
                                            <Collapse in={expandedPlanId === plan._id}>
                                                <div className="p-3 bg-light">
                                                    <h5>Release Schedule & Order Mapping</h5>
                                                    <Table size="sm" bordered hover className="bg-white shadow-sm mt-3">
                                                        <thead className="table-dark">
                                                            <tr>
                                                                <th>Slot</th>
                                                                <th>Product & Attributes</th>
                                                                <th>Trigger</th>
                                                                <th>Est. Delivery</th>
                                                                <th>Sub-Order ID</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {plan.releaseSchedule.map((slot, sIdx) => (
                                                                <tr key={sIdx} className={slot.released ? 'table-success-light' : ''}>
                                                                    <td className="text-center fw-bold">#{slot.itemIndex}</td>
                                                                    <td>
                                                                        <div>{slot.productName}</div>
                                                                        <small className="text-muted">
                                                                            <strong>Size:</strong> {slot.stockBaseSizeLabel || 'N/A'} |
                                                                            <strong> Color:</strong> {slot.hairColorName || 'N/A'}
                                                                        </small>
                                                                    </td>
                                                                    <td>Pay #{slot.triggerPaymentNumber}</td>
                                                                    <td>
                                                                        {slot.scheduledDeliveryDate ? new Date(slot.scheduledDeliveryDate).toLocaleDateString() : 'TBD'}
                                                                    </td>
                                                                    <td>{slot.subOrderId || '-'}</td>
                                                                    <td>
                                                                        {slot.released ? (
                                                                            <div className="d-flex flex-column gap-1">
                                                                                <Badge bg="info">{slot.releaseOrderStatus?.toUpperCase() || 'RELEASED'}</Badge>
                                                                                {slot.shipped ? (
                                                                                    <Badge bg="success">SHIPPED ({new Date(slot.shippedDate).toLocaleDateString()})</Badge>
                                                                                ) : (
                                                                                    <small className="text-danger fw-bold">Deliver by: {slot.deliveredByDate ? new Date(slot.deliveredByDate).toLocaleDateString() : 'TBD'}</small>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <Badge bg="secondary">LOCKED</Badge>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {slot.released && !slot.shipped && (
                                                                            <Button
                                                                                variant="success"
                                                                                size="sm"
                                                                                onClick={(e) => { e.stopPropagation(); handleMarkShipped(plan._id, slot.itemIndex); }}
                                                                                disabled={actionLoading}
                                                                            >
                                                                                Mark Shipped
                                                                            </Button>
                                                                        )}
                                                                        {slot.shipped && slot.trackingNumber && (
                                                                            <small className="d-block" style={{ fontSize: '10px' }}>Tracking: {slot.trackingNumber}</small>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Collapse>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                            {filteredPlans.length === 0 && <tr><td colSpan="7" className="text-center p-5 text-muted">No installment plans found</td></tr>}
                        </tbody>
                    </Table>
                </Card>
            )}
        </div>
    );
};

export default AdminInstallments;
