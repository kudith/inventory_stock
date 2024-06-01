// components/DashboardCard.js
import { Card, CardHeader, CardBody, Text, Link, Grid } from '@nextui-org/react';

const DashboardCard = ({ title, count, link, bgColor }) => {
  return (
    <Card css={{ $$cardColor: bgColor, width: "100%", height: "150px", borderRadius: "15px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", transition: "transform 0.2s", '&:hover': { transform: 'scale(1.05)' } }} className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <Text className="text-tiny uppercase font-bold">{title}</Text>
        <Text className="text-default-500">{count}</Text>
      </CardHeader>
      <CardBody className="overflow-visible py-2 flex justify-center items-center">
        <Link href={link}>
          <Text className="text-white font-bold mt-2" css={{ '&:hover': { textDecoration: 'underline' } }}>More Info</Text>
        </Link>
      </CardBody>
    </Card>
  );
};

export default DashboardCard;
