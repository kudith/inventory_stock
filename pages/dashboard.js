import React from 'react';
import {Box, Card, CardHeader, CardContent, Typography} from '@mui/material';
import {NextUIProvider} from '@nextui-org/react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import Link from 'next/link';

const Dashboard = () => {
    const cards = [
        {title: 'Users', count: 1, link: '/users', bgColor: 'bg-blue-500'},
        {title: 'Product', count: 2, link: '/products', bgColor: 'bg-green-500'},
        {title: 'Supplier', count: 2, link: '/supplier_page', bgColor: 'bg-yellow-500'},
        {title: 'Stock', count: 2, link: '/detail_stock_page', bgColor: 'bg-red-500'},
        {title: 'Product In', count: 2, link: '/transaksi_masuk', bgColor: 'bg-blue-300'},
        {title: 'Product Out', count: 2, link: '/transaksi_keluar_page', bgColor: 'bg-red-700'},
        {title: 'Rejected', count: 1, link: '/reject_page', bgColor: 'bg-gray-400'},
    ];

    return (
        <NextUIProvider>
            <div className="flex">
                <Sidebar/>
                <div className="flex-1 flex flex-col">
                    <DashboardHeader/>
                    <Box className="flex flex-wrap max-w-7xl mx-auto gap-10 justify-center mt-20">
                        {cards.map((card, index) => (
                            <Link href={card.link} key={index} passHref>
                                <span className="no-underline">
                                    <Card
                                        className={`w-72 h-48 p-2 rounded-lg shadow-xl transition-transform duration-200 hover:scale-105 ${card.bgColor}`}
                                    >
                                        <CardHeader
                                            className="pb-0 pt-2 pl-4 flex flex-col items-start"
                                            title={<Typography variant="subtitle1"
                                                               className="text-white text-3xl font-bold uppercase">{card.title}</Typography>}
                                            subheader={<Typography variant="subtitle2"
                                                                   className="text-white">{card.count}</Typography>}
                                        />
                                        <CardContent className="pt-2 flex justify-center items-center">
                                            <span className="text-white font-bold mt-4 hover:underline">More Info</span>
                                        </CardContent>
                                    </Card>
                                </span>
                            </Link>
                        ))}
                    </Box>
                </div>
            </div>
        </NextUIProvider>
    );
};

export default Dashboard;
