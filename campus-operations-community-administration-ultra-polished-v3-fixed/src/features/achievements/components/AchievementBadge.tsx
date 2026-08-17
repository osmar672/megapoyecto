export function AchievementBadge({icon,unlocked}:{icon:string;unlocked:boolean}){return <div aria-label={unlocked?'Insignia desbloqueada':'Insignia bloqueada'}>{icon}</div>}
