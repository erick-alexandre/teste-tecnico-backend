import { readXlsxFile, XlsxData } from "../utils/readXlsx";

export interface GroupedJourney {
    id: string;
    path: XlsxData[];
    quantity: number;
    touchpoints: number;
    totalValue?: number;
}

let memoryCache: GroupedJourney[] | null = null;

export function processJourneys(): GroupedJourney[] {
    if (memoryCache) return memoryCache;

    const rawData = readXlsxFile();

    const sessions: Record<string, XlsxData[]> = {};
    for(const event of rawData) {
        if(!sessions[event.sessionId]) sessions[event.sessionId] = [];
        sessions[event.sessionId].push(event);
    }

    const cleanedSessions = Object.values(sessions).map(events => {
        const ordered = events.sort((a, b) => {
            const timeA = new Date(a.created_at).getTime() || 0;
            const timeB = new Date(b.created_at).getTime() || 0;
            return timeA - timeB;
        });

        const cleaned: XlsxData[] = [];
        const middleChannels = new Set<string>();

        for(let i = 0; i < ordered.length; i++) {
            const event = ordered[i];
            const isFirst = i === 0;
            const isLast = i === ordered.length - 1;

            const channelKey = event.source.trim().toLowerCase()

            if(isFirst || isLast) {
                cleaned.push(event);
                continue;
            }

            if(middleChannels.has(channelKey)) continue;
            
            middleChannels.add(channelKey);
            cleaned.push(event);
        }
        return cleaned;
    });
    const groups: Record<string, GroupedJourney> = {};

    for (const journeyEvents of cleanedSessions) {
        const signature = journeyEvents
            .map(e => e.source.trim().toLowerCase()) 
            .join('>');

        if (!groups[signature]) {
            groups[signature] = {
                id: signature,
                path: journeyEvents,
                quantity: 0,
                touchpoints: journeyEvents.length,
            };
        }
        groups[signature].quantity++;
    }
    const result = Object.values(groups).sort((a, b) => b.quantity - a.quantity);
    memoryCache = result;
    return result;
}