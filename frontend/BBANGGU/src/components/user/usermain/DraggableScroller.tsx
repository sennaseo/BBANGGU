import { ReactNode, CSSProperties, forwardRef } from 'react';
import { useDraggable } from '../../../hooks/useDraggable';

type Props = {
    children: ReactNode;
    className?: string;
    maxWidth?: number;
    style?: CSSProperties;
};

const DraggableScroller = (
    { children, className, maxWidth, style }: Props,
    scollerRef: React.ForwardedRef<HTMLDivElement>
) => {
    const events = useDraggable(scollerRef as React.RefObject<HTMLElement>);

    return (
        <>
            <div
                className={className}
                style = {{
                    display: 'flex',
                    overflow: 'scroll',
                    maxWidth: maxWidth,
                    ...style
                }}
                ref={scollerRef}
                {...events}
            >
                {children}
            </div>
        </>
    );
};

export default forwardRef<HTMLDivElement, Props>(DraggableScroller);