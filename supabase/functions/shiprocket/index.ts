import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

interface ShiprocketAuthResponse {
  token: string;
}

async function getAuthToken(): Promise<string> {
  const email = Deno.env.get('SHIPROCKET_EMAIL');
  const password = Deno.env.get('SHIPROCKET_PASSWORD');

  if (!email || !password) {
    throw new Error('Shiprocket credentials not configured');
  }

  console.log('Authenticating with Shiprocket...');

  const response = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Shiprocket auth failed:', errorText);
    throw new Error(`Shiprocket authentication failed: ${response.status}`);
  }

  const data: ShiprocketAuthResponse = await response.json();
  console.log('Shiprocket authentication successful');
  return data.token;
}

async function createOrder(token: string, orderData: any) {
  console.log('Creating Shiprocket order:', JSON.stringify(orderData));

  const response = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('Shiprocket order creation failed:', JSON.stringify(data));
    throw new Error(`Order creation failed: ${JSON.stringify(data)}`);
  }

  console.log('Shiprocket order created:', JSON.stringify(data));
  return data;
}

async function trackShipment(token: string, shipmentId: string) {
  console.log('Tracking shipment:', shipmentId);

  const response = await fetch(`${SHIPROCKET_API_BASE}/courier/track/shipment/${shipmentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('Shipment tracking failed:', JSON.stringify(data));
    throw new Error(`Tracking failed: ${JSON.stringify(data)}`);
  }

  console.log('Shipment tracking data:', JSON.stringify(data));
  return data;
}

async function getServiceability(token: string, pickupPincode: string, deliveryPincode: string, weight: number, cod: boolean = false) {
  console.log('Checking serviceability:', { pickupPincode, deliveryPincode, weight, cod });

  const params = new URLSearchParams({
    pickup_postcode: pickupPincode,
    delivery_postcode: deliveryPincode,
    weight: weight.toString(),
    cod: cod ? '1' : '0',
  });

  const response = await fetch(`${SHIPROCKET_API_BASE}/courier/serviceability/?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('Serviceability check failed:', JSON.stringify(data));
    throw new Error(`Serviceability check failed: ${JSON.stringify(data)}`);
  }

  console.log('Serviceability data:', JSON.stringify(data));
  return data;
}

async function generateAWB(token: string, shipmentId: string, courierId: string) {
  console.log('Generating AWB for shipment:', shipmentId);

  const response = await fetch(`${SHIPROCKET_API_BASE}/courier/assign/awb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      shipment_id: shipmentId,
      courier_id: courierId,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('AWB generation failed:', JSON.stringify(data));
    throw new Error(`AWB generation failed: ${JSON.stringify(data)}`);
  }

  console.log('AWB generated:', JSON.stringify(data));
  return data;
}

async function schedulePickup(token: string, shipmentId: string) {
  console.log('Scheduling pickup for shipment:', shipmentId);

  const response = await fetch(`${SHIPROCKET_API_BASE}/courier/generate/pickup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      shipment_id: [shipmentId],
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('Pickup scheduling failed:', JSON.stringify(data));
    throw new Error(`Pickup scheduling failed: ${JSON.stringify(data)}`);
  }

  console.log('Pickup scheduled:', JSON.stringify(data));
  return data;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    console.log('Shiprocket action:', action, 'params:', JSON.stringify(params));

    // Get auth token for all requests
    const token = await getAuthToken();

    let result;

    switch (action) {
      case 'create_order':
        result = await createOrder(token, params.orderData);
        break;

      case 'track_shipment':
        result = await trackShipment(token, params.shipmentId);
        break;

      case 'check_serviceability':
        result = await getServiceability(
          token,
          params.pickupPincode,
          params.deliveryPincode,
          params.weight,
          params.cod
        );
        break;

      case 'generate_awb':
        result = await generateAWB(token, params.shipmentId, params.courierId);
        break;

      case 'schedule_pickup':
        result = await schedulePickup(token, params.shipmentId);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Shiprocket error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
