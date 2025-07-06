// src/components/equipment/QuickActionModals.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X,
  Package,
  MapPin,
  Wrench,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { strapiAPI, EquipmentInstance } from "@/lib/api/strapi";

interface QuickActionModalsProps {
  selectedItems: Set<string>;
  instances: EquipmentInstance[];
  onClose: () => void;
  onSuccess: () => void;
  actionType: "status" | "location" | "condition" | "maintenance" | null;
}

export default function QuickActionModals({
  selectedItems,
  instances,
  onClose,
  onSuccess,
  actionType,
}: QuickActionModalsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Status Update Modal
  const StatusUpdateModal = () => {
    const [newStatus, setNewStatus] = useState("");
    const [reason, setReason] = useState("");

    const handleStatusUpdate = async () => {
      if (!newStatus) {
        setError("Please select a status");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const selectedInstances = instances.filter((instance) =>
          selectedItems.has(instance.documentId)
        );

        // Update each selected instance
        await Promise.all(
          selectedInstances.map((instance) =>
            strapiAPI.updateEquipmentInstance(instance.documentId, {
              equipmentStatus: newStatus,
              notes: reason
                ? `Status changed to ${newStatus}: ${reason}`
                : `Status changed to ${newStatus}`,
            })
          )
        );

        onSuccess();
        onClose();
      } catch (err: any) {
        setError(err.message || "Failed to update status");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Update Equipment Status
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Updating {selectedItems.size} equipment instance
              {selectedItems.size > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Status *
          </label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select status...</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Damaged">Damaged</option>
            <option value="Retired">Retired</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reason (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for status change..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleStatusUpdate}
            disabled={loading || !newStatus}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </button>
        </div>
      </div>
    );
  };

  // Location Update Modal
  const LocationUpdateModal = () => {
    const [newLocation, setNewLocation] = useState("");
    const [notes, setNotes] = useState("");

    const commonLocations = [
      "Warehouse A",
      "Warehouse B",
      "Loading Dock",
      "Prep Area",
      "Client Site",
      "Maintenance Shop",
      "Storage Unit 1",
      "Storage Unit 2",
    ];

    const handleLocationUpdate = async () => {
      if (!newLocation.trim()) {
        setError("Please enter a location");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const selectedInstances = instances.filter((instance) =>
          selectedItems.has(instance.documentId)
        );

        // Update each selected instance
        await Promise.all(
          selectedInstances.map((instance) =>
            strapiAPI.updateEquipmentInstance(instance.documentId, {
              location: newLocation.trim(),
              notes: notes
                ? `Location changed to ${newLocation}: ${notes}`
                : `Location changed to ${newLocation}`,
            })
          )
        );

        onSuccess();
        onClose();
      } catch (err: any) {
        setError(err.message || "Failed to update location");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Update Equipment Location
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Updating {selectedItems.size} equipment instance
              {selectedItems.size > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Location *
          </label>
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="Enter location..."
            list="locations"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <datalist id="locations">
            {commonLocations.map((location) => (
              <option key={location} value={location} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {commonLocations.slice(0, 4).map((location) => (
            <button
              key={location}
              onClick={() => setNewLocation(location)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {location}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes about the location change..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleLocationUpdate}
            disabled={loading || !newLocation.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              "Update Location"
            )}
          </button>
        </div>
      </div>
    );
  };

  // Condition Assessment Modal
  const ConditionModal = () => {
    const [condition, setCondition] = useState("");
    const [notes, setNotes] = useState("");

    const conditionOptions = [
      {
        value: "Excellent",
        color: "green",
        description: "Like new, no visible wear",
      },
      {
        value: "Good",
        color: "blue",
        description: "Minor wear, fully functional",
      },
      {
        value: "Fair",
        color: "yellow",
        description: "Visible wear, minor issues",
      },
      {
        value: "Poor",
        color: "orange",
        description: "Significant wear, may need attention",
      },
      {
        value: "Damaged",
        color: "red",
        description: "Not functional, needs repair",
      },
    ];

    const handleConditionUpdate = async () => {
      if (!condition) {
        setError("Please select a condition");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const selectedInstances = instances.filter((instance) =>
          selectedItems.has(instance.documentId)
        );

        // Update each selected instance
        await Promise.all(
          selectedInstances.map((instance) =>
            strapiAPI.updateEquipmentInstance(instance.documentId, {
              condition,
              notes: notes
                ? `Condition assessed as ${condition}: ${notes}`
                : `Condition assessed as ${condition}`,
            })
          )
        );

        onSuccess();
        onClose();
      } catch (err: any) {
        setError(err.message || "Failed to update condition");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Assess Equipment Condition
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Updating {selectedItems.size} equipment instance
              {selectedItems.size > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Condition Assessment *
          </label>
          <div className="space-y-2">
            {conditionOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={condition === option.value}
                  onChange={(e) => setCondition(e.target.value)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        option.color === "green"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : option.color === "blue"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : option.color === "yellow"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                              : option.color === "orange"
                                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      }`}
                    >
                      {option.value}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {option.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assessment Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detailed notes about the equipment condition..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConditionUpdate}
            disabled={loading || !condition}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              "Update Condition"
            )}
          </button>
        </div>
      </div>
    );
  };

  // Maintenance Scheduling Modal
  const MaintenanceModal = () => {
    const [maintenanceDate, setMaintenanceDate] = useState("");
    const [maintenanceType, setMaintenanceType] = useState("");
    const [notes, setNotes] = useState("");

    const maintenanceTypes = [
      "Routine Inspection",
      "Preventive Maintenance",
      "Repair Required",
      "Deep Clean",
      "Calibration",
      "Parts Replacement",
      "Safety Check",
    ];

    const handleMaintenanceSchedule = async () => {
      if (!maintenanceDate || !maintenanceType) {
        setError("Please select maintenance date and type");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const selectedInstances = instances.filter((instance) =>
          selectedItems.has(instance.documentId)
        );

        // Update each selected instance
        await Promise.all(
          selectedInstances.map((instance) =>
            strapiAPI.updateEquipmentInstance(instance.documentId, {
              lastMaintenanceDate: maintenanceDate,
              notes: `${maintenanceType} scheduled for ${maintenanceDate}${notes ? `: ${notes}` : ""}`,
            })
          )
        );

        onSuccess();
        onClose();
      } catch (err: any) {
        setError(err.message || "Failed to schedule maintenance");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Wrench className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Schedule Maintenance
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Scheduling for {selectedItems.size} equipment instance
              {selectedItems.size > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maintenance Date *
            </label>
            <input
              type="date"
              value={maintenanceDate}
              onChange={(e) => setMaintenanceDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maintenance Type *
            </label>
            <select
              value={maintenanceType}
              onChange={(e) => setMaintenanceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select type...</option>
              {maintenanceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Maintenance Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Specific maintenance requirements or notes..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleMaintenanceSchedule}
            disabled={loading || !maintenanceDate || !maintenanceType}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Scheduling...
              </>
            ) : (
              "Schedule Maintenance"
            )}
          </button>
        </div>
      </div>
    );
  };

  if (!actionType || selectedItems.size === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              {actionType === "status" && (
                <Package className="h-5 w-5 text-blue-600" />
              )}
              {actionType === "location" && (
                <MapPin className="h-5 w-5 text-green-600" />
              )}
              {actionType === "condition" && (
                <FileText className="h-5 w-5 text-yellow-600" />
              )}
              {actionType === "maintenance" && (
                <Wrench className="h-5 w-5 text-purple-600" />
              )}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {actionType === "status" && <StatusUpdateModal />}
          {actionType === "location" && <LocationUpdateModal />}
          {actionType === "condition" && <ConditionModal />}
          {actionType === "maintenance" && <MaintenanceModal />}
        </div>
      </div>
    </div>
  );
}
