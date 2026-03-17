import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Alert, Spinner, Card } from 'react-bootstrap';
import { installmentService } from '../../services/installmentService';
import '../shared/Installments.css';
import api from '../../config/api';

const FactoryInstallments = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

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
            setError(err.message || 'Failed to fetch plans');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (planId, itemIndex, trackingNumber) => {
        try {
            setActionLoading(true);
            const response = await installmentService.updateReleaseStatus({
                planId,
                itemIndex,
                shipped: true,
                trackingNumber
            });

            if (response.success) {
                alert('Marked as Shipped');
                fetchPlans();
            }
        } catch (err) {
            alert(err.message || 'Failed to update');
        } finally {
            setActionLoading(false);
        }
    };

    // Flatten all releasable items
    const releasableItems = [];
    plans.forEach(plan => {
        if (plan.status !== 'cancelled') {
            plan.releaseSchedule.forEach(item => {
                if (item.released && !item.shipped) {
                    releasableItems.push({
                        ...item,
                        planId: plan._id,
                        orderNumber: plan.order?.orderNumber
                    });
                }
            });
        }
    });

    return (
        <div className="factory-installments">
            <h3 className="mb-4">Installment Shipments Queue</h3>

            {loading ? <div className="text-center"><Spinner animation="border" /></div> : (
                <>
                    {releasableItems.length === 0 ? <Alert variant="success">No pending shipments.</Alert> : (
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Order #</th>
                                        <th>Sub Order ID</th>
                                        <th>Product / Specs</th>
                                        <th>Released Date</th>
                                        <th>Delivery Deadline</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {releasableItems.map((item, idx) => (
                                        <tr key={`${item.planId}-${item.itemIndex}`}>
                                            <td>{item.orderNumber}</td>
                                            <td>{item.subOrderId}</td>
                                            <td>
                                                <strong>{item.productName}</strong>
                                                <div style={{ fontSize: '0.85em', color: '#666' }}>
                                                    <div>Base: {item.stockBaseSizeLabel || 'N/A'}</div>
                                                    <div>Color: {item.hairColorName || 'N/A'}</div>
                                                </div>
                                            </td>
                                            <td>{new Date(item.releasedDate).toLocaleDateString()}</td>
                                            <td>
                                                {item.deliveredByDate ? (
                                                    <span className="text-danger">
                                                        {new Date(item.deliveredByDate).toLocaleDateString()}
                                                    </span>
                                                ) : 'N/A'}
                                            </td>
                                            <td>
                                                <Form.Group className="d-flex gap-2">
                                                    <Form.Control
                                                        size="sm"
                                                        placeholder="Tracking #"
                                                        id={`tracking-${item.planId}-${item.itemIndex}`}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        disabled={actionLoading}
                                                        onClick={() => {
                                                            const track = document.getElementById(`tracking-${item.planId}-${item.itemIndex}`).value;
                                                            if (!track) return alert('Enter Tracking Number');
                                                            handleUpdateStatus(item.planId, item.itemIndex, track);
                                                        }}
                                                    >
                                                        Ship
                                                    </Button>
                                                </Form.Group>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FactoryInstallments;
