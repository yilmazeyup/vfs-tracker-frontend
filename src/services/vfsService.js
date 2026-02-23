// VFS Service - Mock implementation for demo
class VFSService {
  constructor() {
    this.isScanning = false;
    this.scanInterval = null;
  }

  async validateCredentials(credentials) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple validation - in real app, this would call VFS API
        const isValid = credentials.email && credentials.password && 
                       credentials.email.includes('@') && 
                       credentials.password.length >= 6;
        resolve(isValid);
      }, 1500);
    });
  }

  async startScanning(config, callbacks) {
    this.isScanning = true;
    const { selectedOffices, scanInterval } = config;
    const { onSuccess, onError, onAppointmentFound } = callbacks;

    const scanOffice = async (office) => {
      try {
        // Simulate scanning
        await this.delay(2000 + Math.random() * 3000);
        
        if (!this.isScanning) return;

        // Random scenarios
        const scenarios = [
          { type: 'success', chance: 0.7 },
          { type: 'error', chance: 0.2 },
          { type: 'appointment', chance: 0.1 }
        ];

        const random = Math.random();
        let currentChance = 0;
        
        for (const scenario of scenarios) {
          currentChance += scenario.chance;
          if (random <= currentChance) {
            if (scenario.type === 'success') {
              onSuccess({
                office,
                message: 'No appointments available',
                nextCheck: scanInterval * 1000
              });
            } else if (scenario.type === 'error') {
              onError({
                message: `Error scanning ${office}`,
                description: 'Connection timeout or rate limit',
                code: 'SCAN_ERROR'
              });
            } else if (scenario.type === 'appointment') {
              const appointments = [
                {
                  date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                  time: '09:00',
                  type: 'Regular'
                }
              ];
              
              onAppointmentFound({
                office,
                appointments,
                screenshot: null
              });
            }
            break;
          }
        }
      } catch (error) {
        onError({
          message: `Failed to scan ${office}`,
          description: error.message,
          code: 'NETWORK_ERROR'
        });
      }
    };

    // Start scanning all offices
    const scanAllOffices = async () => {
      for (const office of selectedOffices) {
        if (!this.isScanning) break;
        await scanOffice(office);
      }
      
      if (this.isScanning) {
        setTimeout(scanAllOffices, scanInterval * 1000);
      }
    };

    scanAllOffices();
  }

  stopScanning() {
    this.isScanning = false;
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
  }

  async sendEmailNotification(email, data) {
    // Simulate email sending
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Email notification sent to:', email, data);
        resolve(true);
      }, 1000);
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export default new VFSService();