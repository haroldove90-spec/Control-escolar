export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  status: 'activo' | 'suspendido';
  enrollmentDate: string;
  profilePicture?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  month: string;
  amount: number;
  dueDate: string;
  status: 'pagado' | 'pendiente' | 'vencido' | 'revision';
  paymentDate?: string;
  proofName?: string;
  proofData?: string; // base64 or description
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  role: 'admin' | 'estudiante';
  studentId?: string; // If specific to a student
  type: 'pago_recibido' | 'pago_vencido' | 'pago_por_vencer' | 'revision_pago' | 'suspension' | 'reactivacion';
}

export type UserRole = 'home' | 'admin' | 'estudiante';
