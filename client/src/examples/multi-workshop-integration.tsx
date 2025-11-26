// Example: Frontend Integration for Multi-Workshop Work Orders
// This file shows how to integrate the new workshop management features

import { useState, useEffect } from 'react';

// ============================================
// 1. WORKSHOP STATUS MANAGEMENT
// ============================================

interface Workshop {
    workshopId: string;
    status: 'pending' | 'in_progress' | 'completed';
    startTime: string | null;
    endTime: string | null;
    partsUsed: string[];
    employees: string[];
    notes: string;
}

// Update workshop status
async function updateWorkshopStatus(
    workOrderId: string,
    workshopId: string,
    status: string
) {
    const response = await fetch(
        `/api/work-orders/${workOrderId}/workshops/${workshopId}/status`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        }
    );
    return response.json();
}

// Add parts to workshop
async function addWorkshopParts(
    workOrderId: string,
    workshopId: string,
    partIds: string[]
) {
    const response = await fetch(
        `/api/work-orders/${workOrderId}/workshops/${workshopId}/parts`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ partIds }),
        }
    );
    return response.json();
}

// Add employees to workshop
async function addWorkshopEmployees(
    workOrderId: string,
    workshopId: string,
    employeeIds: string[]
) {
    const response = await fetch(
        `/api/work-orders/${workOrderId}/workshops/${workshopId}/employees`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeIds }),
        }
    );
    return response.json();
}

// Update workshop notes
async function updateWorkshopNotes(
    workOrderId: string,
    workshopId: string,
    notes: string
) {
    const response = await fetch(
        `/api/work-orders/${workOrderId}/workshops/${workshopId}/notes`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes }),
        }
    );
    return response.json();
}

// Check if all workshops completed
async function checkAllWorkshopsCompleted(workOrderId: string) {
    const response = await fetch(
        `/api/work-orders/${workOrderId}/workshops/all-completed`
    );
    const data = await response.json();
    return data.allCompleted;
}

// ============================================
// 2. WORKSHOP DISPLAY COMPONENT EXAMPLE
// ============================================

export function WorkshopStatusCard({ workshop, workOrderId }: {
    workshop: Workshop;
    workOrderId: string;
}) {
    const [notes, setNotes] = useState(workshop.notes);

    const handleStatusChange = async (newStatus: string) => {
        await updateWorkshopStatus(workOrderId, workshop.workshopId, newStatus);
        // Refresh work order data
    };

    const handleNotesUpdate = async () => {
        await updateWorkshopNotes(workOrderId, workshop.workshopId, notes);
    };

    const calculateElapsedTime = () => {
        if (!workshop.startTime) return 'Not started';
        const start = new Date(workshop.startTime);
        const end = workshop.endTime ? new Date(workshop.endTime) : new Date();
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return `${hours.toFixed(1)} hours`;
    };

    return (
        <div className="border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Workshop: {workshop.workshopId}</h3>
                <span className={`px-2 py-1 rounded text-sm ${workshop.status === 'completed' ? 'bg-green-100 text-green-800' :
                        workshop.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                    }`}>
                    {workshop.status}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                    <p className="text-sm text-gray-600">Elapsed Time</p>
                    <p className="font-medium">{calculateElapsedTime()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Parts Used</p>
                    <p className="font-medium">{workshop.partsUsed.length} parts</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Employees</p>
                    <p className="font-medium">{workshop.employees.length} employees</p>
                </div>
            </div>

            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={handleNotesUpdate}
                    className="w-full border rounded p-2 text-sm"
                    rows={2}
                />
            </div>

            {workshop.status !== 'completed' && (
                <div className="flex gap-2">
                    {workshop.status === 'pending' && (
                        <button
                            onClick={() => handleStatusChange('in_progress')}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                        >
                            Start Workshop
                        </button>
                    )}
                    {workshop.status === 'in_progress' && (
                        <button
                            onClick={() => handleStatusChange('completed')}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                        >
                            Complete Workshop
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ============================================
// 3. WORK ORDER CARD WITH WORKSHOPS
// ============================================

export function WorkOrderCard({ workOrder }: { workOrder: any }) {
    const [allCompleted, setAllCompleted] = useState(false);

    useEffect(() => {
        if (workOrder.workshops?.length > 0) {
            checkAllWorkshopsCompleted(workOrder.id).then(setAllCompleted);
        }
    }, [workOrder]);

    const workshops = workOrder.workshops || [];

    return (
        <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">{workOrder.workOrderNumber}</h2>

            {workshops.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Workshop Progress</h3>
                    {workshops.map((workshop: Workshop) => (
                        <WorkshopStatusCard
                            key={workshop.workshopId}
                            workshop={workshop}
                            workOrderId={workOrder.id}
                        />
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    disabled={!allCompleted}
                    className={`px-4 py-2 rounded ${allCompleted
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Mark as Completed
                </button>
                {!allCompleted && workshops.length > 0 && (
                    <p className="text-sm text-gray-600 flex items-center">
                        Complete all workshops to finish this work order
                    </p>
                )}
            </div>
        </div>
    );
}

// ============================================
// 4. ITEM REQUEST DIALOG WITH REJECT/FEEDBACK
// ============================================

export function ItemRequestDialog({ request }: { request: any }) {
    const [rejectReason, setRejectReason] = useState('');
    const [feedback, setFeedback] = useState('');
    const [pendingReason, setPendingReason] = useState('');

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        // Call API to update item request with reject reason
        await fetch(`/api/item-requests/${request.id}/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rejectReason }),
        });
    };

    const handlePending = async () => {
        if (!pendingReason.trim()) {
            alert('Please provide a reason for pending status');
            return;
        }
        // Call API to update item request with pending reason
        await fetch(`/api/item-requests/${request.id}/pending`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pendingReason }),
        });
    };

    const handleFeedback = async () => {
        // Call API to add feedback
        await fetch(`/api/item-requests/${request.id}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feedback }),
        });
    };

    return (
        <div className="p-4">
            <h3 className="font-bold mb-4">Item Request Details</h3>

            {/* Display existing reject reason if any */}
            {request.rejectReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="font-semibold text-red-800">Rejected</p>
                    <p className="text-sm text-red-700">{request.rejectReason}</p>
                </div>
            )}

            {/* Display existing pending reason if any */}
            {request.pendingReason && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="font-semibold text-yellow-800">Pending Purchase</p>
                    <p className="text-sm text-yellow-700">{request.pendingReason}</p>
                </div>
            )}

            {/* Display existing feedback if any */}
            {request.feedback && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="font-semibold text-blue-800">Mechanic Feedback</p>
                    <p className="text-sm text-blue-700">{request.feedback}</p>
                </div>
            )}

            {/* Reject section (for store manager) */}
            <div className="mb-4">
                <label className="block font-medium mb-2">Reject Request</label>
                <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full border rounded p-2 mb-2"
                    rows={3}
                />
                <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Reject Request
                </button>
            </div>

            {/* Pending section (for store manager) */}
            <div className="mb-4">
                <label className="block font-medium mb-2">Mark as Pending Purchase</label>
                <textarea
                    value={pendingReason}
                    onChange={(e) => setPendingReason(e.target.value)}
                    placeholder="Enter reason for pending status (required)..."
                    className="w-full border rounded p-2 mb-2"
                    rows={3}
                />
                <button
                    onClick={handlePending}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Mark as Pending
                </button>
            </div>

            {/* Feedback section (for mechanic) */}
            <div className="mb-4">
                <label className="block font-medium mb-2">Provide Feedback</label>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter feedback about the item..."
                    className="w-full border rounded p-2 mb-2"
                    rows={3}
                />
                <button
                    onClick={handleFeedback}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Submit Feedback
                </button>
            </div>
        </div>
    );
}
