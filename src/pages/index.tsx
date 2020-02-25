/**
 * Routes:
 *   - ./src/routes/PrivateRoute.tsx
 */
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Card, Input, DatePicker, Select, Pagination, Divider, Table, Tooltip, Tabs } from 'antd';
import TabChild from '@/pages/components/TabChild';
import User from '@/storage/User';



const { TabPane } = Tabs;

const Index: React.FC = (props: {}) => {
    const [activeKey, setActiveKey] = useState('1');
    const onChange = useCallback((activeKey: string) => setActiveKey(activeKey), []);
    return useMemo(() => {
        return (
            <main className="main">
                <header className="header">
                    <div className="header-title">
                        供应链管理中台（简易版）
                    </div>
                    <div className="header-user">
                        Hi，{User.userName}
                    </div>
                </header>
                <div className="content">
                    <Card className="card">
                        <Tabs
                            onChange={onChange}
                            activeKey={activeKey}
                            type="card"
                            children={[
                                <TabPane tab="全部" key="1">
                                    <TabChild tabType={0}/>
                                </TabPane>,
                                /*<TabPane tab="待拍单" key="2">
                                    <TabChild type={2}/>
                                </TabPane>,*/
                                <TabPane tab="待支付" key="3">
                                    <TabChild tabType={2}/>
                                </TabPane>,
                                /*<TabPane tab="待发货" key="4">
                                    <TabChild type={4}/>
                                </TabPane>,
                                <TabPane tab="已发货" key="5">
                                    <TabChild type={5}/>
                                </TabPane>,
                                <TabPane tab="已打单" key="6">
                                    <TabChild type={6}/>
                                </TabPane>,*/
                            ]}
                        />
                    </Card>
                </div>
            </main>
        );
    }, [activeKey, props]);
};

export default Index;
