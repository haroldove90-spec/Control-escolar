import { Student, Payment, Notification } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'Sofía García Torres',
    email: 'sofia.garcia@colegio.edu.mx',
    phone: '5512345678',
    grade: '6° de Primaria',
    status: 'activo',
    enrollmentDate: '2025-08-20',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'std-2',
    name: 'Alejandro Mendoza Ruiz',
    email: 'alejandro.mendoza@colegio.edu.mx',
    phone: '5598765432',
    grade: '1° de Secundaria',
    status: 'suspendido',
    enrollmentDate: '2024-08-15',
    profilePicture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'std-3',
    name: 'Valentina Herrera Ortiz',
    email: 'valentina.herrera@colegio.edu.mx',
    phone: '5545678901',
    grade: '3° de Preparatoria',
    status: 'activo',
    enrollmentDate: '2023-08-10',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  // Sofía García
  {
    id: 'pay-1',
    studentId: 'std-1',
    studentName: 'Sofía García Torres',
    month: 'Mayo 2026',
    amount: 1500,
    dueDate: '2026-05-10',
    status: 'pagado',
    paymentDate: '2026-05-04',
    notes: 'Pago en ventanilla'
  },
  {
    id: 'pay-2',
    studentId: 'std-1',
    studentName: 'Sofía García Torres',
    month: 'Junio 2026',
    amount: 1500,
    dueDate: '2026-06-10',
    status: 'pagado',
    paymentDate: '2026-06-05',
    notes: 'Transferencia SPEI'
  },
  {
    id: 'pay-3',
    studentId: 'std-1',
    studentName: 'Sofía García Torres',
    month: 'Julio 2026',
    amount: 1500,
    dueDate: '2026-07-10',
    status: 'pendiente'
  },

  // Alejandro Mendoza
  {
    id: 'pay-4',
    studentId: 'std-2',
    studentName: 'Alejandro Mendoza Ruiz',
    month: 'Mayo 2026',
    amount: 1800,
    dueDate: '2026-05-10',
    status: 'pagado',
    paymentDate: '2026-05-09'
  },
  {
    id: 'pay-5',
    studentId: 'std-2',
    studentName: 'Alejandro Mendoza Ruiz',
    month: 'Junio 2026',
    amount: 1800,
    dueDate: '2026-06-10',
    status: 'vencido',
    notes: 'Pago no recibido en la fecha límite'
  },
  {
    id: 'pay-6',
    studentId: 'std-2',
    studentName: 'Alejandro Mendoza Ruiz',
    month: 'Julio 2026',
    amount: 1800,
    dueDate: '2026-07-10',
    status: 'pendiente'
  },

  // Valentina Herrera
  {
    id: 'pay-7',
    studentId: 'std-3',
    studentName: 'Valentina Herrera Ortiz',
    month: 'Junio 2026',
    amount: 2200,
    dueDate: '2026-06-10',
    status: 'pagado',
    paymentDate: '2026-06-08',
    notes: 'Transferencia bancaria'
  },
  {
    id: 'pay-8',
    studentId: 'std-3',
    studentName: 'Valentina Herrera Ortiz',
    month: 'Julio 2026',
    amount: 2200,
    dueDate: '2026-07-10',
    status: 'revision',
    proofName: 'comprobante_banco_julio.pdf',
    proofData: 'Simulated Receipt Data: SPEI Ref: 9812401',
    notes: 'Hola maestro, ya realicé mi transferencia de julio. Quedo al pendiente.'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Comprobante Recibido',
    message: 'Valentina Herrera Ortiz ha enviado un comprobante de pago para Julio 2026. Requiere tu revisión.',
    timestamp: '2026-07-02T10:30:00-07:00',
    read: false,
    role: 'admin',
    studentId: 'std-3',
    type: 'revision_pago'
  },
  {
    id: 'notif-2',
    title: 'Pago Próximo a Vencer',
    message: 'Tu pago de colegiatura para el mes de Julio 2026 vence el 10 de Julio ($1,500.00 MXN).',
    timestamp: '2026-07-01T09:00:00-07:00',
    read: false,
    role: 'estudiante',
    studentId: 'std-1',
    type: 'pago_por_vencer'
  },
  {
    id: 'notif-3',
    title: 'Aviso de Suspensión',
    message: 'Has sido suspendido temporalmente por falta de pago del mes de Junio 2026. Por favor contacta a administración.',
    timestamp: '2026-06-11T08:00:00-07:00',
    read: false,
    role: 'estudiante',
    studentId: 'std-2',
    type: 'suspension'
  },
  {
    id: 'notif-4',
    title: 'Pago Registrado',
    message: 'Sofía García Torres realizó su pago de Junio 2026 con éxito.',
    timestamp: '2026-06-05T14:20:00-07:00',
    read: true,
    role: 'admin',
    studentId: 'std-1',
    type: 'pago_recibido'
  }
];
