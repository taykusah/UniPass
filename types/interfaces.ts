// types/interfaces.ts

// User Interfaces
export interface BaseUser {
   id: string;
   name: string;
   email: string;
   role: UserRole;
 }
 
 export type UserRole = 'student' | 'admin' | 'security' | 'dean' | 'staff';
 
 export interface Student extends BaseUser {
   role: 'student';
   matricNumber: string;
   department: string;
   level: string;
 }
 
 export interface Admin extends BaseUser {
   role: 'admin' | 'dean' | 'staff';
   department: string;
   position: string;
 }
 
 export interface SecurityPersonnel extends BaseUser {
   role: 'security';
   shift: 'morning' | 'afternoon' | 'night';
   post: string;
 }
 
 // Exeat Request Interfaces
 export interface ExeatRequest {
   id: string;
   studentId: string;
   studentName: string;
   matricNumber: string;
   reason: string;
   departureDate: string;
   departureTime: string;
   returnDate: string;
   returnTime: string;
   parentNumber: string;
   status: ExeatStatus;
   parentApproval: ApprovalStatus;
   deanApproval: ApprovalStatus;
   qrCode?: string;
   createdAt: string;
   updatedAt: string;
 }
 
 export type ExeatStatus = 
   | 'pending_parent_approval' 
   | 'pending_dean_approval' 
   | 'approved' 
   | 'denied' 
   | 'completed' 
   | 'overdue';
 
 export type ApprovalStatus = 
   | 'pending' 
   | 'approved' 
   | 'denied' 
   | null;
 
 // Gate Activity Interfaces
 export interface GateActivity {
   id: string;
   exeatId: string;
   studentId: string;
   type: 'entry' | 'exit';
   timestamp: string;
   securityId: string;
   status: 'valid' | 'invalid' | 'overdue';
   notes?: string;
 }
 
 // Parent Approval Interface
 export interface ParentApproval {
   id: string;
   exeatId: string;
   parentNumber: string;
   status: ApprovalStatus;
   calledBy: string;
   calledAt: string;
   notes?: string;
 }
 
 // Notification Interface
 export interface Notification {
   id: string;
   userId: string;
   type: NotificationType;
   message: string;
   read: boolean;
   createdAt: string;
 }
 
 export type NotificationType = 
   | 'exeat_request'
   | 'parent_approval'
   | 'dean_approval'
   | 'return_reminder'
   | 'overdue_alert'
   | 'gate_activity';
 
 // Report Interface
 export interface ExeatReport {
   totalRequests: number;
   approved: number;
   denied: number;
   pending: number;
   overdue: number;
   complianceRate: number;
   peakPeriods: {
     period: string;
     count: number;
   }[];
   departmentStats: {
     department: string;
     count: number;
   }[];
 }
 
 // Penalty Interface
 export interface Penalty {
   id: string;
   studentId: string;
   exeatId: string;
   type: 'overdue' | 'unauthorized_exit';
   amount: number;
   status: 'pending' | 'paid';
   createdAt: string;
   paidAt?: string;
 }