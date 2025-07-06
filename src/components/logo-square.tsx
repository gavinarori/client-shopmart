import clsx from 'clsx';
import Image from 'next/image';

export default function LogoSquare({ size }: { size?: 'sm' | undefined }) {
  return (
    <div
      className={clsx(
        'flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black overflow-hidden',
        {
          'h-[40px] w-[40px] rounded-xl': !size,
          'h-[30px] w-[30px] rounded-lg': size === 'sm'
        }
      )}
    >
      <Image
        src="/assests/logo.jpeg"
        alt="Kicksvaultke Logo"
        width={size === 'sm' ? 20 : 32}
        height={size === 'sm' ? 20 : 32}
        className="object-cover rounded-xl"
      />
    </div>
  );
}
