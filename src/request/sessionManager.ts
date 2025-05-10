class SessionManager {
    private static instance: SessionManager;
    private currentSessionId: string | null = null;
    private sessionExpireTime: number | null = null;
    private readonly EXPIRE_TIME = 5 * 60 * 1000; // 5分钟

    private constructor() {}

    public static getInstance(): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    private generateUniqueSessionId(): string {
        const timestamp = Date.now();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return `${uuid}-${timestamp}`;
    }

    public getSessionId(): string {
        const now = Date.now();
        
        // 如果没有sessionId或者已过期就生成新的
        if (!this.currentSessionId || 
            !this.sessionExpireTime || 
            now >= this.sessionExpireTime) {
            this.currentSessionId = this.generateUniqueSessionId();
            this.sessionExpireTime = now + this.EXPIRE_TIME;
        }
        
        return this.currentSessionId;
    }

    public clearSession(): void {
        this.currentSessionId = null;
        this.sessionExpireTime = null;
    }
}

export const sessionManager = SessionManager.getInstance();