/// <reference types="react" />
interface AvatarProps {
    url: string;
    eyeBlink?: boolean;
    headMovement?: boolean;
    onLoaded?: () => void;
}
export default function Avatar({ url, eyeBlink, headMovement, onLoaded, }: AvatarProps): JSX.Element;
export {};
