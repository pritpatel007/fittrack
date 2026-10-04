const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('node:dns');
const bcrypt = require('bcryptjs');

dotenv.config();
if (process.env.MONGO_DNS_SERVERS) {
  dns.setServers(process.env.MONGO_DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean));
}

const User = require('../models/User');
const TrainerProfile = require('../models/TrainerProfile');
const MembershipPlan = require('../models/MembershipPlan');
const Membership = require('../models/Membership');
const Class = require('../models/Class');
const Booking = require('../models/Booking');
const Attendance = require('../models/Attendance');
const WorkoutPlan = require('../models/WorkoutPlan');
const ProgressLog = require('../models/ProgressLog');
const ContactMessage = require('../models/ContactMessage');

mongoose.connect(process.env.MONGO_URI);

const seed = async () => {
  try {
    // Clear all collections
    await Promise.all([
      User.deleteMany(), TrainerProfile.deleteMany(), MembershipPlan.deleteMany(),
      Membership.deleteMany(), Class.deleteMany(), Booking.deleteMany(),
      Attendance.deleteMany(), WorkoutPlan.deleteMany(), ProgressLog.deleteMany(),
      ContactMessage.deleteMany(),
    ]);
    console.log('🗑️  Cleared all collections');

    // ─── Users ────────────────────────────────────────────────────────────
    const hashedPw = await bcrypt.hash('password123', 12);

    const [admin, trainer1, trainer2, ...members] = await User.insertMany([
      {
        name: 'Alex Morgan', email: 'admin@fittrack.com', password: hashedPw,
        role: 'admin', phone: '555-0100', age: 35, gender: 'male',
        fitnessGoal: 'Managing FitTrack operations',
      },
      {
        name: 'Marcus Rivera', email: 'marcus@fittrack.com', password: hashedPw,
        role: 'trainer', phone: '555-0101', age: 32, gender: 'male',
        fitnessGoal: 'Helping clients build strength',
      },
      {
        name: 'Priya Sharma', email: 'priya@fittrack.com', password: hashedPw,
        role: 'trainer', phone: '555-0102', age: 29, gender: 'female',
        fitnessGoal: 'Yoga and mindfulness coaching',
      },
      {
        name: 'James Chen', email: 'james@fittrack.com', password: hashedPw,
        role: 'member', phone: '555-0201', age: 28, gender: 'male',
        fitnessGoal: 'Lose weight and build muscle',
      },
      {
        name: 'Sofia Patel', email: 'sofia@fittrack.com', password: hashedPw,
        role: 'member', phone: '555-0202', age: 25, gender: 'female',
        fitnessGoal: 'Improve flexibility and core strength',
      },
      {
        name: 'David Kim', email: 'david@fittrack.com', password: hashedPw,
        role: 'member', phone: '555-0203', age: 34, gender: 'male',
        fitnessGoal: 'Marathon training',
      },
      {
        name: 'Aisha Johnson', email: 'aisha@fittrack.com', password: hashedPw,
        role: 'member', phone: '555-0204', age: 27, gender: 'female',
        fitnessGoal: 'Gain muscle mass',
      },
      {
        name: 'Liam Torres', email: 'liam@fittrack.com', password: hashedPw,
        role: 'member', phone: '555-0205', age: 22, gender: 'male',
        fitnessGoal: 'General fitness and endurance',
      },
    ]);

    console.log('✅ Users created');

    // ─── Trainer Profiles ─────────────────────────────────────────────────
    await TrainerProfile.insertMany([
      {
        userId: trainer1._id,
        specialization: ['Strength Training', 'HIIT', 'Cardio'],
        experience: 8,
        bio: 'Certified personal trainer with 8 years of experience helping clients achieve their fitness goals through evidence-based strength and conditioning programs.',
        certifications: ['NASM-CPT', 'CrossFit Level 2', 'First Aid/CPR'],
        rating: 4.9,
      },
      {
        userId: trainer2._id,
        specialization: ['Yoga', 'Pilates', 'Zumba'],
        experience: 6,
        bio: 'Passionate yoga instructor and wellness coach dedicated to helping clients find balance through movement, breath, and mindfulness practices.',
        certifications: ['RYT-500', 'Pilates Instructor', 'Zumba Fitness'],
        rating: 4.8,
      },
    ]);

    console.log('✅ Trainer profiles created');

    // ─── Membership Plans ─────────────────────────────────────────────────
    const [basicPlan, standardPlan, premiumPlan] = await MembershipPlan.insertMany([
      {
        name: 'Basic',
        price: 29,
        durationInDays: 30,
        features: ['Gym Access (6AM-10PM)', '2 Group Classes/Month', 'Locker Access', 'Basic App Features'],
        color: '#64748b',
        isActive: true,
      },
      {
        name: 'Standard',
        price: 59,
        durationInDays: 30,
        features: ['Unlimited Gym Access', '10 Group Classes/Month', 'Personal Trainer Consultation', 'Nutrition Guide', 'Locker & Towel Service'],
        color: '#6366f1',
        isActive: true,
      },
      {
        name: 'Premium',
        price: 99,
        durationInDays: 30,
        features: ['24/7 Gym Access', 'Unlimited Group Classes', 'Dedicated Personal Trainer', 'Custom Meal Plan', 'Body Composition Analysis', 'Priority Booking', 'Guest Passes (2/month)'],
        color: '#f59e0b',
        isActive: true,
      },
    ]);

    console.log('✅ Membership plans created');

    // ─── Memberships ──────────────────────────────────────────────────────
    const now = new Date();
    const future30 = new Date(now); future30.setDate(now.getDate() + 30);
    const future15 = new Date(now); future15.setDate(now.getDate() + 15);
    const past = new Date(now); past.setDate(now.getDate() - 5);
    const past30 = new Date(now); past30.setDate(now.getDate() - 30);

    await Membership.insertMany([
      { userId: members[0]._id, planId: premiumPlan._id, startDate: now, endDate: future30, status: 'active', paymentStatus: 'paid' },
      { userId: members[1]._id, planId: standardPlan._id, startDate: now, endDate: future15, status: 'active', paymentStatus: 'paid' },
      { userId: members[2]._id, planId: basicPlan._id, startDate: now, endDate: future30, status: 'active', paymentStatus: 'paid' },
      { userId: members[3]._id, planId: premiumPlan._id, startDate: now, endDate: future30, status: 'active', paymentStatus: 'paid' },
      { userId: members[4]._id, planId: standardPlan._id, startDate: past30, endDate: past, status: 'expired', paymentStatus: 'paid' },
    ]);

    console.log('✅ Memberships created');

    // ─── Classes ──────────────────────────────────────────────────────────
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
    const day3 = new Date(now); day3.setDate(now.getDate() + 3);
    const day5 = new Date(now); day5.setDate(now.getDate() + 5);
    const day7 = new Date(now); day7.setDate(now.getDate() + 7);
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);

    const [c1, c2, c3, c4, c5] = await Class.insertMany([
      {
        name: 'Power HIIT', category: 'HIIT', trainerId: trainer1._id,
        description: 'High-intensity interval training designed to maximize calorie burn and build explosive power.',
        date: tomorrow, time: '07:00 AM', duration: 45, capacity: 15,
        enrolledMembers: [members[0]._id, members[2]._id], location: 'Studio A',
      },
      {
        name: 'Morning Yoga Flow', category: 'Yoga', trainerId: trainer2._id,
        description: 'Energizing yoga flow to start your day with intention. Suitable for all levels.',
        date: tomorrow, time: '09:00 AM', duration: 60, capacity: 20,
        enrolledMembers: [members[1]._id, members[3]._id], location: 'Yoga Room',
      },
      {
        name: 'Zumba Party', category: 'Zumba', trainerId: trainer2._id,
        description: 'Dance your way to fitness! High energy Zumba class with Latin rhythms.',
        date: day3, time: '06:00 PM', duration: 50, capacity: 25,
        enrolledMembers: [members[1]._id], location: 'Main Hall',
      },
      {
        name: 'Strength Foundations', category: 'Strength Training', trainerId: trainer1._id,
        description: 'Build functional strength using barbells, dumbbells, and bodyweight movements.',
        date: day5, time: '05:30 PM', duration: 60, capacity: 12,
        enrolledMembers: [members[0]._id, members[3]._id, members[4]._id], location: 'Weight Room',
      },
      {
        name: 'Cardio Blast', category: 'Cardio', trainerId: trainer1._id,
        description: 'Heart-pumping cardio session mixing treadmill intervals, rowing, and cycling.',
        date: day7, time: '08:00 AM', duration: 40, capacity: 20,
        enrolledMembers: [members[2]._id], location: 'Cardio Floor',
      },
    ]);

    console.log('✅ Classes created');

    // ─── Bookings ─────────────────────────────────────────────────────────
    await Booking.insertMany([
      { userId: members[0]._id, classId: c1._id, status: 'confirmed' },
      { userId: members[2]._id, classId: c1._id, status: 'confirmed' },
      { userId: members[1]._id, classId: c2._id, status: 'confirmed' },
      { userId: members[3]._id, classId: c2._id, status: 'confirmed' },
      { userId: members[1]._id, classId: c3._id, status: 'confirmed' },
      { userId: members[0]._id, classId: c4._id, status: 'confirmed' },
      { userId: members[3]._id, classId: c4._id, status: 'confirmed' },
      { userId: members[4]._id, classId: c4._id, status: 'confirmed' },
      { userId: members[2]._id, classId: c5._id, status: 'confirmed' },
    ]);

    console.log('✅ Bookings created');

    // ─── Attendance ───────────────────────────────────────────────────────
    const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };

    await Attendance.insertMany([
      { userId: members[0]._id, date: daysAgo(1), status: 'present', markedBy: admin._id },
      { userId: members[0]._id, date: daysAgo(3), status: 'present', markedBy: admin._id },
      { userId: members[0]._id, date: daysAgo(5), status: 'absent', markedBy: admin._id },
      { userId: members[0]._id, date: daysAgo(7), status: 'present', markedBy: admin._id },
      { userId: members[1]._id, date: daysAgo(1), status: 'present', markedBy: trainer2._id },
      { userId: members[1]._id, date: daysAgo(4), status: 'present', markedBy: trainer2._id },
      { userId: members[1]._id, date: daysAgo(6), status: 'late', markedBy: trainer2._id },
      { userId: members[2]._id, date: daysAgo(2), status: 'present', markedBy: admin._id },
      { userId: members[2]._id, date: daysAgo(4), status: 'present', markedBy: admin._id },
      { userId: members[3]._id, date: daysAgo(1), status: 'present', markedBy: trainer1._id },
      { userId: members[3]._id, date: daysAgo(3), status: 'absent', markedBy: trainer1._id },
      { userId: members[4]._id, date: daysAgo(2), status: 'present', markedBy: admin._id },
    ]);

    console.log('✅ Attendance records created');

    // ─── Workout Plans ────────────────────────────────────────────────────
    await WorkoutPlan.insertMany([
      {
        memberId: members[0]._id,
        trainerId: trainer1._id,
        goal: 'Lose 10kg and build lean muscle in 12 weeks',
        notes: 'Focus on compound movements. Increase weight by 5% each week.',
        schedule: [
          { day: 'Monday', exerciseName: 'Barbell Squat', sets: 4, reps: 8, restTime: 90 },
          { day: 'Monday', exerciseName: 'Romanian Deadlift', sets: 3, reps: 10, restTime: 90 },
          { day: 'Monday', exerciseName: 'Leg Press', sets: 3, reps: 12, restTime: 60 },
          { day: 'Wednesday', exerciseName: 'Bench Press', sets: 4, reps: 8, restTime: 90 },
          { day: 'Wednesday', exerciseName: 'Incline Dumbbell Press', sets: 3, reps: 10, restTime: 60 },
          { day: 'Wednesday', exerciseName: 'Cable Fly', sets: 3, reps: 15, restTime: 45 },
          { day: 'Friday', exerciseName: 'Pull-ups', sets: 4, reps: 6, restTime: 90 },
          { day: 'Friday', exerciseName: 'Barbell Row', sets: 4, reps: 8, restTime: 90 },
          { day: 'Friday', exerciseName: 'Face Pulls', sets: 3, reps: 15, restTime: 45 },
          { day: 'Saturday', exerciseName: 'HIIT Treadmill', sets: 1, duration: 25, restTime: 0 },
        ],
      },
      {
        memberId: members[1]._id,
        trainerId: trainer2._id,
        goal: 'Improve flexibility, core strength, and mindfulness',
        notes: 'Combine yoga with core work. Emphasis on breath control.',
        schedule: [
          { day: 'Monday', exerciseName: 'Sun Salutation', sets: 3, duration: 10, restTime: 30 },
          { day: 'Monday', exerciseName: 'Warrior Sequence', sets: 2, duration: 15, restTime: 30 },
          { day: 'Wednesday', exerciseName: 'Plank Hold', sets: 4, duration: 1, restTime: 60 },
          { day: 'Wednesday', exerciseName: 'Bicycle Crunches', sets: 3, reps: 20, restTime: 45 },
          { day: 'Wednesday', exerciseName: 'Dead Bug', sets: 3, reps: 12, restTime: 45 },
          { day: 'Friday', exerciseName: 'Yin Yoga Flow', sets: 1, duration: 45, restTime: 0 },
          { day: 'Sunday', exerciseName: 'Meditation & Breathwork', sets: 1, duration: 20, restTime: 0 },
        ],
      },
    ]);

    console.log('✅ Workout plans created');

    // ─── Progress Logs ────────────────────────────────────────────────────
    const progressEntries = [];
    const baseWeights = [92, 62, 85, 68, 78];
    const baseHeights = [178, 164, 182, 168, 175];

    for (let i = 0; i < 5; i++) {
      for (let w = 0; w < 4; w++) {
        const weightChange = -(w * 0.8) + (Math.random() * 0.4 - 0.2);
        const weight = parseFloat((baseWeights[i] + weightChange * (i % 2 === 0 ? 1 : -1)).toFixed(1));
        const height = baseHeights[i];
        const bmi = parseFloat((weight / ((height / 100) ** 2)).toFixed(1));
        progressEntries.push({
          userId: members[i]._id,
          weight, height, bmi,
          date: daysAgo(21 - w * 7),
          notes: w === 3 ? 'Feeling stronger this week!' : undefined,
        });
      }
    }
    await ProgressLog.insertMany(progressEntries);

    console.log('✅ Progress logs created');

    // ─── Contact Messages ─────────────────────────────────────────────────
    await ContactMessage.insertMany([
      { name: 'Sarah Wilson', email: 'sarah@example.com', subject: 'Membership inquiry', message: 'Hi, I would like to know more about your Premium plan and if there are any student discounts available.', isRead: false },
      { name: 'Tom Brady', email: 'tom@example.com', subject: 'Personal training', message: 'I am interested in one-on-one personal training sessions. Can you tell me about availability and pricing?', isRead: true },
      { name: 'Emma Davis', email: 'emma@example.com', subject: 'Class schedule', message: 'Could you send me the full weekly class schedule? I am particularly interested in yoga and pilates.', isRead: false },
    ]);

    console.log('✅ Contact messages created');
    console.log('\n🎉 Seeding complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Login credentials (all use password: password123)');
    console.log('  Admin:   admin@fittrack.com');
    console.log('  Trainer: marcus@fittrack.com | priya@fittrack.com');
    console.log('  Member:  james@fittrack.com  | sofia@fittrack.com');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seed();
