export declare const PLAN_LIMITS: {
    readonly FREE: {
        readonly queriesPerMonth: 1000;
        readonly storageMB: 500;
        readonly documentsCount: 5;
        readonly maxFileSizeMB: 10;
        readonly models: readonly ["gpt-4o-mini"];
    };
    readonly PRO: {
        readonly queriesPerMonth: 25000;
        readonly storageMB: 50000;
        readonly documentsCount: 100;
        readonly maxFileSizeMB: 50;
        readonly models: readonly ["gpt-4o-mini", "gpt-4-turbo", "claude-3-haiku", "gemini-1.5-flash"];
    };
    readonly BUSINESS: {
        readonly queriesPerMonth: 1000000;
        readonly storageMB: 1000000;
        readonly documentsCount: 1000;
        readonly maxFileSizeMB: 100;
        readonly models: readonly ["gpt-4o", "claude-3-opus", "gemini-1.5-pro"];
    };
    readonly ENTERPRISE: {
        readonly queriesPerMonth: number;
        readonly storageMB: number;
        readonly documentsCount: number;
        readonly maxFileSizeMB: 500;
        readonly models: readonly ["all"];
    };
};
export type PlanType = keyof typeof PLAN_LIMITS;
//# sourceMappingURL=plans.d.ts.map