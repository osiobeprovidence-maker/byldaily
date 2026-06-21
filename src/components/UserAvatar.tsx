import { User as UserIcon } from 'lucide-react';
import type { User } from '../types';

type UserAvatarProps = {
  user?: Pick<User, 'name' | 'username' | 'avatarUrl'> | null;
  className?: string;
  imageClassName?: string;
  iconSize?: number;
};

function getInitials(user?: Pick<User, 'name' | 'username'> | null) {
  const label = user?.name || user?.username || '';
  const initials = label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  return initials.toUpperCase();
}

export function UserAvatar({
  user,
  className = 'w-8 h-8 rounded-full',
  imageClassName = '',
  iconSize = 18,
}: UserAvatarProps) {
  const initials = getInitials(user);

  return (
    <div className={`${className} overflow-hidden bg-byl-dark/5 flex items-center justify-center text-byl-dark/50 border border-byl-dark/10`}>
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name || user.username || 'Profile'}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover ${imageClassName}`}
        />
      ) : initials ? (
        <span className="text-[10px] font-black uppercase tracking-widest text-byl-dark/60">{initials}</span>
      ) : (
        <UserIcon size={iconSize} />
      )}
    </div>
  );
}
