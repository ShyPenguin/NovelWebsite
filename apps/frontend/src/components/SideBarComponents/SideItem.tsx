import type { IconProps } from "../../types";

type SideItemProps = {
  icon: React.ComponentType<IconProps>;
  children: React.ReactNode;
};

function SideItem({ icon, children }: SideItemProps) {
  const IconComponent = icon;

  return (
    <div className="side-item">
      <div className="flex-center">
        <IconComponent className="w-5 h-5 text-primary-gray" />
      </div>
      {children}
    </div>
  );
}

export default SideItem;
