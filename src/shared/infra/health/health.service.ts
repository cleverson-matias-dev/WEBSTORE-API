import type { DataSource } from "typeorm";

// health.service.ts
export interface HealthStatus {
  status: 'ok' | 'error';
  uptime: number;
  timestamp: string;
  checks: {
    database: 'up' | 'down';
  };
}

export const getHealthStatus = async (dataSource: DataSource): Promise<HealthStatus> => {
    
 try {
    
    await dataSource.query('SELECT 1');
    
    return {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        checks: {
            database: 'up'
        },
    };
    
  } catch (error) {
    console.log(error)
    return {
        status: 'error',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        checks: {
            database: 'down',
        },
    };
  }

  
};
