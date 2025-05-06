// controllers/health-status.js
const { supabase } = require('../config/supabase');
const { predictHealthRisks } = require('../services/azureML');

const getHealthStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch recent vitals and medical history
    const { data: vitalsData, error: vitalsError } = await supabase
      .from('vitals')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(50);
    if (vitalsError) throw new Error(vitalsError.message);

    const { data: medicalHistory, error: historyError } = await supabase
      .from('medical_history')
      .select('*')
      .eq('user_id', userId);
    if (historyError) throw new Error(historyError.message);

    // Use Azure ML to predict health risks
    const healthRisks = await predictHealthRisks({ vitals: vitalsData, medicalHistory });

    const status = {
      status: healthRisks.riskLevel || 'Stable',
      message: healthRisks.summary || 'No immediate health concerns detected.',
    };

    res.json(status);
  } catch (err) {
    console.error('Error fetching health status:', err);
    res.status(500).json({ error: 'Failed to fetch health status' });
  }
};

module.exports = { getHealthStatus };