import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Send, CheckCircle2, AlertTriangle, MapPin, Radio, Trash2, AlertCircle, BellOff, Filter } from 'lucide-react';
import { DisasterAlert } from '../../types';
import { db } from '../../services/mockBackendApi';
import { KARNATAKA_LOCATIONS } from '../../services/weatherService';

interface AdminDisasterControlProps {
  onAlertPublished?: () => void;
}

export const AdminDisasterControl: React.FC<AdminDisasterControlProps> = ({ onAlertPublished }) => {
  const [alerts, setAlerts] = useState<DisasterAlert[]>(() => db.getAlerts());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<DisasterAlert | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [selectedFilterDistrict, setSelectedFilterDistrict] = useState<string>('ALL');

  // Form states
  const [title, setTitle] = useState('');
  const [disasterType, setDisasterType] = useState<DisasterAlert['disasterType']>('HEAVY_RAIN');
  const [severity, setSeverity] = useState<DisasterAlert['severity']>('WARNING');
  const [selectedDistrict, setSelectedDistrict] = useState('Kalaburagi');
  const [selectedTaluk, setSelectedTaluk] = useState('Kalaburagi');
  const [description, setDescription] = useState('');
  const [farmImpact, setFarmImpact] = useState('');
  const [affectedResources, setAffectedResources] = useState('Tur Crops, Low-lying storage, Cattle sheds');
  const [recommendedActions, setRecommendedActions] = useState('Clear field drainage bunds, Elevate seed bags, Disconnect open borewell starters');

  // Auto clear toast after 4s
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // Listen to alert updates across the app
  useEffect(() => {
    const handleSync = () => {
      setAlerts(db.getAlerts());
    };
    window.addEventListener('kisan_alerts_updated', handleSync);
    return () => window.removeEventListener('kisan_alerts_updated', handleSync);
  }, []);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const isStatewide = selectedDistrict === 'ALL_STATEWIDE';

    const newAlert: DisasterAlert = {
      id: `alt-${isStatewide ? 'state' : selectedDistrict.substring(0, 3).toLowerCase()}-${Date.now().toString().slice(-4)}`,
      title,
      disasterType,
      severity,
      districts: isStatewide ? ['All Districts (Statewide)'] : [selectedDistrict],
      taluks: isStatewide ? ['All Taluks'] : [selectedTaluk],
      issuedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      description,
      farmImpact,
      affectedResources: affectedResources.split(',').map((s) => s.trim()),
      recommendedActions: recommendedActions.split(',').map((s) => s.trim()),
      createdBy: 'Directorate of Agriculture & KSNDMC State Control',
      isActive: true,
    };

    db.saveAlert(newAlert);
    db.addAuditLog({
      adminName: 'Dr. Siddharamaiah M.',
      action: 'PUBLISH_DISASTER_ALERT',
      entityType: 'ALERT',
      entityId: newAlert.id,
      details: `Dispatched ${severity} early warning for ${selectedDistrict} (${selectedTaluk}) to all enrolled farmers.`,
    });

    setAlerts(db.getAlerts());
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setFarmImpact('');
    if (onAlertPublished) onAlertPublished();
    setSuccessToast(`Alert "${newAlert.title}" published successfully across farmer dashboards!`);
  };

  const confirmDeleteAction = () => {
    if (!alertToDelete) return;

    const targetId = alertToDelete.id;
    const targetTitle = alertToDelete.title;

    db.deleteAlert(targetId);
    db.addAuditLog({
      adminName: 'Dr. Siddharamaiah M.',
      action: 'WITHDRAW_DISASTER_ALERT',
      entityType: 'ALERT',
      entityId: targetId,
      details: `Admin withdrew and permanently removed disaster warning "${targetTitle}" from all farmer dashboards.`,
    });

    setAlerts(db.getAlerts());
    setAlertToDelete(null);
    if (onAlertPublished) onAlertPublished();
    setSuccessToast(`Alert "${targetTitle}" was successfully deleted and removed from all farmer dashboards.`);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (selectedFilterDistrict === 'ALL') return true;
    return a.districts.includes(selectedFilterDistrict);
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-[#DC4444] animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B]">
              Disaster Early Warning Control Centre
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Broadcast or withdraw meteorological warnings, heavy rain alerts, and drought advisories directly across all Karnataka farmers' dashboards.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#DC4444] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Broadcast New Alert
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E2E8E4]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#65736B]" />
          <span className="text-xs font-bold text-[#17211B]">Filter by District:</span>
          <select
            value={selectedFilterDistrict}
            onChange={(e) => setSelectedFilterDistrict(e.target.value)}
            className="bg-white border border-[#E2E8E4] rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#146B3A]"
          >
            <option value="ALL">All Karnataka Districts ({alerts.length})</option>
            {Array.from(new Set(KARNATAKA_LOCATIONS.map((l) => l.district))).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-[#65736B]">
          Showing <strong>{filteredAlerts.length}</strong> active alerts
        </span>
      </div>

      {/* Active Broadcasts */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#E2E8E4] p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#17211B]">No Active Warnings in This Zone</h3>
            <p className="text-xs text-[#65736B] max-w-md mx-auto">
              All previous disaster alerts have been resolved or withdrawn. Click "Broadcast New Alert" if weather conditions change.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alt) => (
            <div
              key={alt.id}
              className="bg-white rounded-2xl border-2 border-red-200 p-5 sm:p-6 shadow-xs relative overflow-hidden group hover:border-red-300 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8E4]">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="bg-[#DC4444] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                    {alt.severity}
                  </span>
                  <h3 className="text-base font-bold text-[#17211B]">{alt.title}</h3>
                  <span className="text-xs font-mono text-[#65736B] bg-[#F7F9F8] px-2 py-0.5 rounded border border-[#E2E8E4]">
                    {alt.id}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#65736B]">
                    Issued: {new Date(alt.issuedAt).toLocaleString()}
                  </span>

                  {/* Delete Alert Button */}
                  <button
                    onClick={() => setAlertToDelete(alt)}
                    className="bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 hover:border-red-600 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                    title="Withdraw & Delete this alert for all farmers"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Alert</span>
                  </button>
                </div>
              </div>

              <div className="my-3.5 space-y-2.5 text-xs">
                <p className="text-[#17211B] font-medium leading-relaxed">{alt.description}</p>
                <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-red-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Farm Impact:</strong> {alt.farmImpact}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-[#65736B] pt-1 border-t border-[#F0F2F1]">
                  <span>
                    <strong>Districts:</strong> {alt.districts.join(', ')}
                  </span>
                  <span>
                    <strong>Taluks:</strong> {alt.taluks.join(', ')}
                  </span>
                  <span>
                    <strong>Disaster Type:</strong> {alt.disasterType}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E4] mb-4">
              <h2 className="text-lg font-bold text-[#17211B] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#DC4444]" /> Issue Official Disaster Alert
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-[#65736B] hover:text-[#17211B]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Alert Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Alert: Heavy Precipitation & Flood Ingress"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm focus:outline-[#146B3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Disaster Category</label>
                  <select
                    value={disasterType}
                    onChange={(e) => setDisasterType(e.target.value as any)}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs"
                  >
                    <option value="HEAVY_RAIN">Heavy Rainfall</option>
                    <option value="FLOOD">Riverine / Flash Flood</option>
                    <option value="DROUGHT">Severe Drought / Dry Spell</option>
                    <option value="HEATWAVE">Extreme Heatwave</option>
                    <option value="CYCLONIC_WINDS">Squall / High Wind</option>
                    <option value="HAILSTORM">Hailstorm</option>
                    <option value="PEST_SWARM">Pest Outbreak</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs font-bold"
                  >
                    <option value="WARNING">WARNING (High Risk)</option>
                    <option value="EMERGENCY">EMERGENCY (Critical Evacuation)</option>
                    <option value="WATCH">WATCH (Advisory)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Target District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      if (e.target.value === 'ALL_STATEWIDE') {
                        setSelectedTaluk('All Taluks');
                      } else {
                        const tList = KARNATAKA_LOCATIONS.filter((l) => l.district === e.target.value);
                        if (tList.length > 0) setSelectedTaluk(tList[0].taluk);
                      }
                    }}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs font-medium"
                  >
                    <option value="ALL_STATEWIDE">🚨 All Districts (Statewide Broadcast)</option>
                    {Array.from(new Set(KARNATAKA_LOCATIONS.map((l) => l.district))).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#17211B] mb-1">Target Taluk</label>
                  <select
                    value={selectedTaluk}
                    onChange={(e) => setSelectedTaluk(e.target.value)}
                    disabled={selectedDistrict === 'ALL_STATEWIDE'}
                    className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs font-medium disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    {selectedDistrict === 'ALL_STATEWIDE' ? (
                      <option value="All Taluks">All Taluks (Statewide)</option>
                    ) : (
                      KARNATAKA_LOCATIONS.filter((l) => l.district === selectedDistrict).map((t) => (
                        <option key={t.taluk} value={t.taluk}>
                          {t.taluk}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Meteorological Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Deep depression formed over Deccan plateau. Sustained downpour 80-110mm expected..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-[#E2E8E4] rounded-lg p-2.5 text-xs focus:outline-[#146B3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Farm Impact Assessment</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Severe water stagnation in black soil Tur fields; lodging risk in tall sorghum..."
                  value={farmImpact}
                  onChange={(e) => setFarmImpact(e.target.value)}
                  className="w-full border border-[#E2E8E4] rounded-lg p-2.5 text-xs focus:outline-[#146B3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Affected Resources (Comma separated)</label>
                <input
                  type="text"
                  value={affectedResources}
                  onChange={(e) => setAffectedResources(e.target.value)}
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Recommended Actions (Comma separated)</label>
                <input
                  type="text"
                  value={recommendedActions}
                  onChange={(e) => setRecommendedActions(e.target.value)}
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E2E8E4]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-[#65736B] hover:text-[#17211B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#DC4444] hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Alert Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Toast Notification Banner */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17211B] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-xs text-gray-400 hover:text-white ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Delete / Withdraw Alert Confirmation Modal */}
      {alertToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-extrabold text-[#17211B]">
                Withdraw & Delete Disaster Alert?
              </h3>
              <p className="text-xs text-[#65736B]">
                You are about to delete the alert:
              </p>
              <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-xs font-bold text-red-900 text-left">
                "{alertToDelete.title}"
                <div className="text-[11px] font-normal text-red-700 mt-1">
                  Target: {alertToDelete.districts.join(', ')} ({alertToDelete.taluks.join(', ')})
                </div>
              </div>
              <p className="text-[11px] text-red-600 font-semibold pt-1">
                ⚠️ This will IMMEDIATELY remove the warning banner and risk advisory from all farmers' screens in Karnataka.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E2E8E4]">
              <button
                type="button"
                onClick={() => setAlertToDelete(null)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-[#65736B] hover:text-[#17211B] hover:bg-[#F7F9F8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
