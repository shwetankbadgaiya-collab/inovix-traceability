import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.alert.deleteMany();
  await prisma.sensorReading.deleteMany();
  await prisma.blockchainEvent.deleteMany();
  await prisma.supplyChainEvent.deleteMany();
  await prisma.qRCode.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.ioTNode.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const users = await Promise.all([
    prisma.user.create({ data: { email: 'farmer@demo.inovix.com', passwordHash: hashedPassword, name: 'Rajesh Patel', role: 'FARMER', organization: 'Patel Farms', location: 'Indore, MP', phone: '+91 9876543210' } }),
    prisma.user.create({ data: { email: 'collector@demo.inovix.com', passwordHash: hashedPassword, name: 'Priya Sharma', role: 'COLLECTION_CENTER', organization: 'AgriCollect MP', location: 'Dewas, MP', phone: '+91 9876543211' } }),
    prisma.user.create({ data: { email: 'processor@demo.inovix.com', passwordHash: hashedPassword, name: 'Amit Verma', role: 'PROCESSOR', organization: 'Verma Foods Processing', location: 'Bhopal, MP', phone: '+91 9876543212' } }),
    prisma.user.create({ data: { email: 'warehouse@demo.inovix.com', passwordHash: hashedPassword, name: 'Sunita Reddy', role: 'WAREHOUSE', organization: 'Central Warehousing', location: 'Nagpur, MH', phone: '+91 9876543213' } }),
    prisma.user.create({ data: { email: 'logistics@demo.inovix.com', passwordHash: hashedPassword, name: 'Vikram Singh', role: 'LOGISTICS', organization: 'Singh Logistics', location: 'Mumbai, MH', phone: '+91 9876543214' } }),
    prisma.user.create({ data: { email: 'retailer@demo.inovix.com', passwordHash: hashedPassword, name: 'Neha Gupta', role: 'RETAILER', organization: 'Gupta Fresh Mart', location: 'Delhi', phone: '+91 9876543215' } }),
    prisma.user.create({ data: { email: 'consumer@demo.inovix.com', passwordHash: hashedPassword, name: 'Arjun Mehta', role: 'CONSUMER', organization: 'Individual', location: 'Bangalore, KA', phone: '+91 9876543216' } }),
    prisma.user.create({ data: { email: 'regulator@demo.inovix.com', passwordHash: hashedPassword, name: 'Dr. Kavita Joshi', role: 'REGULATOR', organization: 'FSSAI Quality Board', location: 'Delhi', phone: '+91 9876543217' } }),
    prisma.user.create({ data: { email: 'admin@demo.inovix.com', passwordHash: hashedPassword, name: 'System Admin', role: 'ADMIN', organization: 'INOVIX Platform Ops', location: 'Bangalore, KA', phone: '+91 9876543218' } }),
  ]);
  
  const usersByRole: Record<string, any> = {};
  users.forEach(u => { usersByRole[u.role] = u; });

  console.log('Seeding IoT Nodes...');
  const nodes = await Promise.all([
    prisma.ioTNode.create({ data: { id: 'NODE-ESP32-001', status: 'ONLINE', battery: 87, connectivity: 'WIFI', latitude: 22.7196, longitude: 75.8577, locationLabel: 'Indore, MP', firmwareVersion: '1.2.4' } }),
    prisma.ioTNode.create({ data: { id: 'NODE-ESP32-002', status: 'ONLINE', battery: 72, connectivity: 'CELLULAR', latitude: 23.1793, longitude: 75.7849, locationLabel: 'Ujjain, MP', firmwareVersion: '1.2.4' } }),
    prisma.ioTNode.create({ data: { id: 'NODE-ESP32-003', status: 'ONLINE', battery: 95, connectivity: 'WIFI', latitude: 16.9902, longitude: 73.3120, locationLabel: 'Ratnagiri, MH', firmwareVersion: '1.2.4' } }),
    prisma.ioTNode.create({ data: { id: 'NODE-ESP32-004', status: 'WARNING', battery: 18, connectivity: 'LORA', latitude: 23.2004, longitude: 77.0851, locationLabel: 'Sehore, MP', firmwareVersion: '1.1.8' } }),
    prisma.ioTNode.create({ data: { id: 'NODE-ESP32-005', status: 'ONLINE', battery: 65, connectivity: 'WIFI', latitude: 22.5645, longitude: 72.9289, locationLabel: 'Anand, GJ', firmwareVersion: '1.2.4' } }),
    prisma.ioTNode.create({ data: { id: 'NODE-ESP32-006', status: 'OFFLINE', battery: 5, connectivity: 'CELLULAR', latitude: 21.1458, longitude: 79.0882, locationLabel: 'Nagpur, MH', firmwareVersion: '1.0.9' } }),
  ]);

  console.log('Seeding Batches...');
  const farmer = usersByRole['FARMER'];

  const batch1 = await prisma.batch.create({
    data: {
      id: 'INV-2026-001',
      product: 'Organic Tomatoes',
      crop: 'Tomato - Hybrid Roma',
      farmName: 'Patel Farms, Indore',
      farmerId: farmer.id,
      farmerName: farmer.name,
      quantity: 500,
      unit: 'kg',
      currentStage: 'TRANSPORT',
      currentLocation: 'NH 46 En Route to Bhopal',
      status: 'IN_TRANSIT',
      iotNodeId: 'NODE-ESP32-001',
      qrToken: 'tok-inv-2026-001-roma',
      description: 'Grade-A Roma tomatoes harvested at 5:30 AM under controlled moisture conditions.'
    }
  });

  const batch2 = await prisma.batch.create({
    data: {
      id: 'INV-2026-002',
      product: 'Basmati Rice',
      crop: 'Rice - Basmati 1121',
      farmName: 'Ujjain Agro fields',
      farmerId: farmer.id,
      farmerName: farmer.name,
      quantity: 2000,
      unit: 'kg',
      currentStage: 'WAREHOUSE',
      currentLocation: 'Central Cold Storage, Nagpur',
      status: 'ACTIVE',
      iotNodeId: 'NODE-ESP32-002',
      qrToken: 'tok-inv-2026-002-rice',
      description: 'Aged long-grain Basmati rice batch packaged in moisture-proof polypropylene bags.'
    }
  });

  const batch3 = await prisma.batch.create({
    data: {
      id: 'INV-2026-003',
      product: 'Alphonso Mangoes',
      crop: 'Mango - Ratnagiri Hapus',
      farmName: 'Ratnagiri Coastal Orchards',
      farmerId: farmer.id,
      farmerName: farmer.name,
      quantity: 300,
      unit: 'boxes',
      currentStage: 'RETAIL',
      currentLocation: 'Gupta Fresh Mart - Delhi Sector 14',
      status: 'COMPLETED',
      iotNodeId: 'NODE-ESP32-003',
      qrToken: 'tok-inv-2026-003-mango',
      description: 'GI-tagged Ratnagiri Alphonso mangoes delivered and verified for retail consumers.'
    }
  });

  const batch4 = await prisma.batch.create({
    data: {
      id: 'INV-2026-004',
      product: 'Organic Sharbati Wheat',
      crop: 'Wheat - C-306 Golden Grain',
      farmName: 'Sehore Black Soil Farm',
      farmerId: farmer.id,
      farmerName: farmer.name,
      quantity: 1500,
      unit: 'kg',
      currentStage: 'PROCESSING',
      currentLocation: 'Verma Flour & Milling Complex, Bhopal',
      status: 'ACTIVE',
      iotNodeId: 'NODE-ESP32-004',
      qrToken: 'tok-inv-2026-004-wheat',
      description: 'High-protein organic wheat undergoing automated cleaning, sorting, and lab testing.'
    }
  });

  const batch5 = await prisma.batch.create({
    data: {
      id: 'INV-2026-005',
      product: 'Fresh A2 Cow Milk',
      crop: 'Dairy - Gir Cow Raw Milk',
      farmName: 'Anand Organic Cooperative',
      farmerId: farmer.id,
      farmerName: farmer.name,
      quantity: 1000,
      unit: 'L',
      currentStage: 'COLLECTION',
      currentLocation: 'District Chilling Center Dewas',
      status: 'ACTIVE',
      iotNodeId: 'NODE-ESP32-005',
      qrToken: 'tok-inv-2026-005-milk',
      description: 'Unpasteurized fresh raw milk kept strictly below 4°C in insulated stainless steel tanks.'
    }
  });

  // Link IoT nodes to batches
  await prisma.ioTNode.update({ where: { id: 'NODE-ESP32-001' }, data: { batchId: batch1.id } });
  await prisma.ioTNode.update({ where: { id: 'NODE-ESP32-002' }, data: { batchId: batch2.id } });
  await prisma.ioTNode.update({ where: { id: 'NODE-ESP32-003' }, data: { batchId: batch3.id } });
  await prisma.ioTNode.update({ where: { id: 'NODE-ESP32-004' }, data: { batchId: batch4.id } });
  await prisma.ioTNode.update({ where: { id: 'NODE-ESP32-005' }, data: { batchId: batch5.id } });

  console.log('Seeding QR Codes...');
  const allBatches = [batch1, batch2, batch3, batch4, batch5];
  for (const b of allBatches) {
    await prisma.qRCode.create({
      data: {
        batchId: b.id,
        token: b.qrToken!,
        createdBy: farmer.id
      }
    });
  }

  console.log('Seeding Supply Chain & Blockchain Events...');
  let blockNum = 1042;
  const generateTxHash = () => '0x' + crypto.randomBytes(32).toString('hex');

  const createEventsForBatch = async (batch: any, stages: string[]) => {
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      let actor = farmer;
      let action = 'Batch harvested and created at origin';
      let location = batch.farmName;
      let temp = 23.5;
      let hum = 58.0;

      if (stage === 'COLLECTION') {
        actor = usersByRole['COLLECTION_CENTER'];
        action = 'Batch quality verified and aggregated at collection hub';
        location = 'Dewas District Agri Hub';
        temp = 22.8;
        hum = 60.5;
      } else if (stage === 'PROCESSING') {
        actor = usersByRole['PROCESSOR'];
        action = 'Secondary sorting, grading, and clean-air packaging completed';
        location = 'Verma Processing Unit #2, Bhopal';
        temp = 21.2;
        hum = 55.0;
      } else if (stage === 'WAREHOUSE') {
        actor = usersByRole['WAREHOUSE'];
        action = 'Cold-room check-in with continuous IoT atmospheric tracking';
        location = 'Nagpur Central Hub Bay-4';
        temp = 18.4;
        hum = 62.0;
      } else if (stage === 'TRANSPORT') {
        actor = usersByRole['LOGISTICS'];
        action = 'GPS & refrigerated fleet dispatch via reefer truck';
        location = 'Interstate Transit NH-46';
        temp = 24.2;
        hum = 61.2;
      } else if (stage === 'RETAIL') {
        actor = usersByRole['RETAILER'];
        action = 'Final retail shelf inspection and consumer QR tag verified';
        location = 'Gupta Mart, Store 12, Delhi';
        temp = 22.0;
        hum = 59.0;
      }

      const txHash = generateTxHash();
      const eventTime = new Date(Date.now() - (stages.length - i) * 14400000); // 4 hours apart

      await prisma.supplyChainEvent.create({
        data: {
          batchId: batch.id,
          stage,
          eventType: stage === 'FARM' ? 'BATCH_CREATED' : 'STAGE_TRANSFERRED',
          action,
          location,
          actorId: actor.id,
          actorName: actor.name,
          actorRole: actor.role,
          temperature: temp,
          humidity: hum,
          notes: `Handled by ${actor.name} (${actor.organization})`,
          blockchainTxHash: txHash,
          createdAt: eventTime
        }
      });

      await prisma.blockchainEvent.create({
        data: {
          batchId: batch.id,
          eventType: stage === 'FARM' ? 'BATCH_CREATED' : 'STAGE_TRANSFERRED',
          actorId: actor.id,
          actorName: actor.name,
          actorRole: actor.role,
          txHash,
          blockNumber: blockNum++,
          status: 'VERIFIED',
          data: JSON.stringify({ stage, location, temperature: temp, humidity: hum, handler: actor.name }),
          createdAt: eventTime,
          confirmedAt: new Date(eventTime.getTime() + 2500)
        }
      });
    }
  };

  await createEventsForBatch(batch1, ['FARM', 'COLLECTION', 'PROCESSING', 'WAREHOUSE', 'TRANSPORT']);
  await createEventsForBatch(batch2, ['FARM', 'COLLECTION', 'PROCESSING', 'WAREHOUSE']);
  await createEventsForBatch(batch3, ['FARM', 'COLLECTION', 'PROCESSING', 'WAREHOUSE', 'TRANSPORT', 'RETAIL']);
  await createEventsForBatch(batch4, ['FARM', 'COLLECTION', 'PROCESSING']);
  await createEventsForBatch(batch5, ['FARM', 'COLLECTION']);

  console.log('Seeding Sensor Readings for active in-transit node...');
  const baseLat = 22.7196;
  const baseLng = 75.8577;
  const readings = [];
  for (let i = 0; i < 25; i++) {
    readings.push({
      nodeId: 'NODE-ESP32-001',
      batchId: batch1.id,
      temperature: parseFloat((23.0 + (i * 0.15) + (Math.random() * 0.4 - 0.2)).toFixed(2)),
      humidity: parseFloat((59.0 + (Math.sin(i / 3) * 4)).toFixed(2)),
      latitude: parseFloat((baseLat + i * 0.021).toFixed(4)),
      longitude: parseFloat((baseLng + i * 0.055).toFixed(4)),
      battery: parseFloat((88 - i * 0.05).toFixed(1)),
      synced: true,
      createdAt: new Date(Date.now() - (25 - i) * 600000) // Every 10 min
    });
  }
  await prisma.sensorReading.createMany({ data: readings });

  console.log('Seeding Alerts...');
  await prisma.alert.createMany({
    data: [
      {
        type: 'TEMPERATURE',
        severity: 'CRITICAL',
        title: 'High Temperature Detected',
        message: 'Batch INV-2026-001 temperature reached 27.8°C during transit (threshold: 25.0°C)',
        batchId: batch1.id,
        nodeId: 'NODE-ESP32-001',
        value: 27.8,
        threshold: 25.0,
        acknowledged: false
      },
      {
        type: 'BATTERY',
        severity: 'WARNING',
        title: 'Low Battery Alert',
        message: 'Node NODE-ESP32-004 battery is down to 18%, please plug in solar recharge pack',
        batchId: batch4.id,
        nodeId: 'NODE-ESP32-004',
        value: 18.0,
        threshold: 20.0,
        acknowledged: false
      },
      {
        type: 'HUMIDITY',
        severity: 'WARNING',
        title: 'High Humidity In Storage Bay',
        message: 'Warehouse humidity reached 72% for Basmati Rice batch INV-2026-002',
        batchId: batch2.id,
        nodeId: 'NODE-ESP32-002',
        value: 72.0,
        threshold: 70.0,
        acknowledged: false
      },
      {
        type: 'CONNECTIVITY',
        severity: 'CRITICAL',
        title: 'IoT Node Connectivity Dropped',
        message: 'NODE-ESP32-006 has not pinged telemetry packets in the last 45 minutes',
        batchId: null,
        nodeId: 'NODE-ESP32-006',
        value: 45,
        threshold: 15,
        acknowledged: false
      }
    ]
  });

  console.log('✅ Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
