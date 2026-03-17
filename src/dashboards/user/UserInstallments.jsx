import React, { useState, useEffect } from 'react';
import { Badge, Button, Card, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import { installmentService } from '../../services/installmentService';
import '../shared/Installments.css';

const UserInstallments = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentLoading, setPaymentLoading] = useState(false);

    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await installmentService.getPlans();
            if (response.success) {
                setPlans(response.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to load installment plans');
        } finally {
            setLoading(false);
        }
    };

    const handlePayNext = async (plan) => {
        if (!confirm(`Confirm payment of $${plan.installmentAmount.toFixed(2)}?`)) return;

        try {
            setPaymentLoading(true);
            const response = await installmentService.recordPayment({
                planId: plan._id,
                amount: plan.installmentAmount
            });

            if (response.success) {
                alert('Payment successful!');
                fetchPlans(); // Refresh
            }
        } catch (err) {
            alert(err.message || 'Payment failed');
        } finally {
            setPaymentLoading(false);
        }
    };

    const handlePayRemaining = async (plan) => {
        const remaining = plan.totalAmount - plan.amountPaid;
        if (!confirm(`Confirm early payoff of $${remaining.toFixed(2)}? This will release all remaining items.`)) return;

        try {
            setPaymentLoading(true);
            const response = await installmentService.payRemainingBalance(plan._id);

            if (response.success) {
                alert('Full payoff successful! All items are now being processed for release.');
                fetchPlans();
            }
        } catch (err) {
            alert(err.message || 'Payoff failed');
        } finally {
            setPaymentLoading(false);
        }
    };

    if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (plans.length === 0) return <Alert variant="info">You have no active installment plans.</Alert>;

    return (
        <div className="user-installments">
            <h3 className="mb-4">My Installment Plans</h3>
            {plans.map((plan, idx) => (
                <Card key={plan._id} className={`mb-4 installment-card fade-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Order #{plan.order?.orderNumber}</strong>
                            <span className="text-muted ms-2">({new Date(plan.createdAt).toLocaleDateString()})</span>
                        </div>
                        <Badge bg={plan.status === 'active' ? 'success' : plan.status === 'completed' ? 'primary' : 'secondary'}>
                            {plan.status.toUpperCase()}
                        </Badge>
                    </Card.Header>
                    <Card.Body>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <small className="text-muted">Total Amount</small>
                                <h4>${plan.totalAmount.toFixed(2)}</h4>
                            </div>
                            <div className="col-md-4">
                                <small className="text-muted">Paid So Far</small>
                                <h4 className="text-success">${plan.amountPaid.toFixed(2)}</h4>
                            </div>
                            <div className="col-md-4">
                                <small className="text-muted">Remaining</small>
                                <h4 className="text-danger">${(plan.totalAmount - plan.amountPaid).toFixed(2)}</h4>
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                                <span>Progress ({plan.installmentsPaid} / {plan.totalInstallments} months)</span>
                                <span>{Math.round((plan.amountPaid / plan.totalAmount) * 100)}%</span>
                            </div>
                            <ProgressBar
                                now={(plan.amountPaid / plan.totalAmount) * 100}
                                variant="success"
                                striped={plan.status === 'active'}
                            />
                        </div>

                        <h5 className="mt-4">Release Schedule</h5>
                        <div className="table-responsive">
                            <table className="table table-sm table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th>Item / Product</th>
                                        <th>Release Threshold</th>
                                        <th>Status</th>
                                        <th>Tracking Info</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plan.releaseSchedule.map((item, idx) => (
                                        <tr key={idx} className={item.released ? 'table-success' : ''}>
                                            <td>
                                                Item #{item.itemIndex}
                                                {item.productName && <div className="text-muted small">{item.productName}</div>}
                                            </td>
                                            <td>Paid &ge; ${item.requiredAmount.toFixed(2)}</td>
                                            <td>
                                                {item.released ? (
                                                    <Badge bg={
                                                        item.releaseOrderStatus === 'delivered' ? 'success' :
                                                            item.releaseOrderStatus === 'shipped' ? 'primary' :
                                                                item.releaseOrderStatus === 'ready_to_ship' ? 'warning' :
                                                                    item.releaseOrderStatus === 'confirmed' ? 'info' : 'secondary'
                                                    }>
                                                        {item.releaseOrderStatus ? item.releaseOrderStatus.toUpperCase() : 'RELEASED'}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted"><i className="fas fa-lock me-2"></i>Locked</span>
                                                )}
                                            </td>
                                            <td>
                                                {item.subOrderId ? (
                                                    <Badge bg="info">{item.subOrderId}</Badge>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-end gap-2">
                        {plan.status === 'active' && (
                            <Button
                                variant="success"
                                onClick={() => handlePayNext(plan)}
                                disabled={paymentLoading}
                            >
                                {paymentLoading ? 'Processing...' : `Pay ${getOrdinal(plan.installmentsPaid + 1)} Installment ($${plan.installmentAmount.toFixed(2)})`}
                            </Button>
                        )}
                        {plan.status === 'active' && (
                            <Button
                                variant="outline-primary"
                                onClick={() => handlePayRemaining(plan)}
                                disabled={paymentLoading}
                            >
                                Pay Remaining Balance
                            </Button>
                        )}
                    </Card.Footer>
                </Card>
            ))}
        </div>
    );
};

export default UserInstallments;
