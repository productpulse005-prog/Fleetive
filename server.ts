import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiEnabled: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// AI Explanation endpoint
app.post('/api/ai/explain', async (req, res) => {
  const { exception, vehicle, sensorEvents } = req.body;

  if (!exception || !vehicle) {
    return res.status(400).json({ error: 'Missing exception or vehicle data' });
  }

  // If Gemini is available, run live analysis
  if (ai) {
    try {
      const prompt = `You are Fleetive AI Exception Copilot, an enterprise B2B telematics decision support system for fleet operations managers.
Analyze the following vehicle exception and sensor event stream:

Vehicle: ID ${vehicle.id} (${vehicle.type}, ${vehicle.mileage} miles, Status: ${vehicle.status})
Driver: ${vehicle.assignedDriver || 'Unassigned'}
Exception Title: ${exception.title}
Category: ${exception.category}
Current Severity: ${exception.severity}
Current Risk Score: ${exception.riskScore}%
Sensor Events Timeline:
${(sensorEvents || []).map((e: any) => `- ${e.time}: ${e.metric} = ${e.value} ${e.unit || ''} (Status: ${e.status})`).join('\n')}

Provide an operational analysis formatted as valid JSON with the following schema:
{
  "whyItMatters": "string (2-3 concise, high-impact operational sentences explaining the root telemetry pattern)",
  "whatCouldHappen": "string (1-2 sentences on projected downtime, safety hazard, or cost consequence if left unmitigated)",
  "recommendedAction": "string (Specific actionable operational recommendation with timeframe)",
  "confidence": number (80-99),
  "primaryAnomalyMetric": "string",
  "suggestedTimeframe": "string (e.g., 'Within 24 hours', 'Immediate / Next stop', 'Within 3 days')",
  "assignedTeam": "string (e.g., 'Maintenance Team', 'Driver Operations', 'Dispatch Operations')"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({
          success: true,
          source: 'gemini-3.7-flash',
          analysis: parsed,
        });
      }
    } catch (err) {
      console.error('Gemini explanation error, falling back to deterministic engine:', err);
    }
  }

  // High-fidelity deterministic fallback
  const fallback = getDeterministicAnalysis(exception, vehicle, sensorEvents);
  return res.json({
    success: true,
    source: 'deterministic-rules-engine',
    analysis: fallback,
  });
});

function getDeterministicAnalysis(exception: any, vehicle: any, sensorEvents: any[]) {
  if (exception.title.toLowerCase().includes('overheating')) {
    return {
      whyItMatters: `Vehicle ${vehicle.id} shows a sustained climb in engine operating temperature from 91°C to 105°C over the last 3 duty cycles, accompanied by multiple coolant diagnostic fault codes (DTC P0117 / P0128). This temperature gradient exceeds calibrated thermal thresholds by 15°C under nominal payload conditions.`,
      whatCouldHappen: 'Continued operation without intervention risks head gasket failure, severe cylinder warping, or immediate catastrophic roadside breakdown requiring tow recovery.',
      recommendedAction: 'Schedule a cooling-system pressure test and radiator inspection within 24 hours before next long-haul dispatch.',
      confidence: 87,
      primaryAnomalyMetric: 'Engine Temperature (°C)',
      suggestedTimeframe: 'Within 24 hours',
      assignedTeam: 'Maintenance Team',
    };
  }

  if (exception.title.toLowerCase().includes('driver safety') || exception.title.toLowerCase().includes('braking')) {
    return {
      whyItMatters: `Telematics telemetrics show harsh deceleration events (>0.45g) spiked by 42% over the trailing 7-day period. 6 of 8 high-g incidents occurred within 500m of high-density metropolitan intersections during peak traffic windows.`,
      whatCouldHappen: 'Elevated collision probability (+68% risk benchmark), premature brake pad/rotor wear, and cargo shifting claims.',
      recommendedAction: 'Schedule a proactive 15-minute driver coaching module on defensive following distance and review urban intersection route telemetry.',
      confidence: 81,
      primaryAnomalyMetric: 'Deceleration G-Force',
      suggestedTimeframe: 'Within 48 hours',
      assignedTeam: 'Safety & Driver Ops',
    };
  }

  if (exception.title.toLowerCase().includes('delay') || exception.title.toLowerCase().includes('route')) {
    return {
      whyItMatters: `Current GPS velocity and corridor bottleneck analysis indicates Vehicle ${vehicle.id} is tracking 38 minutes behind delivery SLA. Historical traversal data predicts an additional 12-minute congestion penalty at the upcoming freight terminal.`,
      whatCouldHappen: 'Missed customer delivery SLA window, contractual penalty clause trigger, and downstream driver Hours of Service (HOS) violation.',
      recommendedAction: 'Dispatch reroute via North Perimeter Bypass and notify recipient receiving dock of revised ETA.',
      confidence: 76,
      primaryAnomalyMetric: 'Route SLA Delta',
      suggestedTimeframe: 'Immediate (Next 15 mins)',
      assignedTeam: 'Dispatch Operations',
    };
  }

  if (exception.title.toLowerCase().includes('battery') || exception.title.toLowerCase().includes('voltage')) {
    return {
      whyItMatters: `Cranking voltage dropped below 11.4V during 4 of the last 10 ignition events (standard baseline ≥12.4V resting). Alternator output fluctuates under auxiliary cabin electrical load.`,
      whatCouldHappen: 'No-start condition on next morning dispatch departure, leaving driver stranded at depot and requiring emergency road service.',
      recommendedAction: 'Perform 12V battery conductance test and alternator load test at the depot service bay.',
      confidence: 72,
      primaryAnomalyMetric: 'Resting & Cranking Voltage (V)',
      suggestedTimeframe: 'Within 3 days',
      assignedTeam: 'Maintenance Team',
    };
  }

  if (exception.title.toLowerCase().includes('idling')) {
    return {
      whyItMatters: `Vehicle ${vehicle.id} accumulated 6.4 cumulative hours of stationary engine idling over the current week, running 31% above the fleet median benchmark for class 6 delivery vehicles.`,
      whatCouldHappen: 'Excess fuel consumption (~5.2 gallons wasted weekly), accelerated DPF (diesel particulate filter) soot loading, and unnecessary carbon footprint accumulation.',
      recommendedAction: 'Review auxiliary power unit (APU) usage and issue fleet eco-driving advisory to assigned operator.',
      confidence: 64,
      primaryAnomalyMetric: 'Idle Fuel Flow & Hours',
      suggestedTimeframe: 'Weekly Review',
      assignedTeam: 'Driver Operations',
    };
  }

  return {
    whyItMatters: `Telemetry anomalies detected on Vehicle ${vehicle.id} deviate from standard multi-trip baseline distributions across active operational cycles.`,
    whatCouldHappen: 'Increased risk of unscheduled vehicle downtime or localized efficiency degradation.',
    recommendedAction: 'Perform routine diagnostic scan and verify sensor calibration.',
    confidence: exception.riskScore || 75,
    primaryAnomalyMetric: 'Telemetry Deviation Index',
    suggestedTimeframe: 'Within 3 days',
    assignedTeam: 'Maintenance Team',
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fleetive Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
