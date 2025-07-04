import apiClient from './api';

export interface ReportData {
  id: number;
  title: string;
  type: string;
  date: string;
  status: string;
  data: any;
}

class ReportService {
  async getReports(): Promise<ReportData[]> {
    // Données simulées pour l'instant
    return Promise.resolve([
      {
        id: 1,
        title: "Rapport Mensuel",
        type: "monthly",
        date: new Date().toISOString(),
        status: "completed",
        data: {}
      }
    ]);
  }

  async getReportById(id: number): Promise<ReportData> {
    return Promise.resolve({
      id,
      title: "Rapport",
      type: "custom",
      date: new Date().toISOString(),
      status: "completed",
      data: {}
    });
  }
}

export default new ReportService();