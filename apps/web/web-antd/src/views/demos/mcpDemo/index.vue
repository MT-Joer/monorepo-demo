<template>
    <Page title="二手车交易系统" type="primary">
        <div class="used-car-trading-system">
            <!-- 车辆管理模块 -->
            <Card class="module-section" title="车辆管理">
                <div class="module-content">
                    <div class="sub-module">
                        <h3>车辆列表</h3>
                        <List :data-source="vehicles"
                              item-layout="horizontal"
                              :pagination="{
                                  onChange: (page) => console.log(page),
                                  pageSize: 3,
                              }">
                            <template #renderItem="{ item }">
                                <ListItem>
                                    <ListItemMeta :avatar="h('img', { src: item.image, style: 'width: 80px; height: 60px; object-fit: cover; border-radius: 4px;' })"
                                                  :description="`年份: ${item.year} | 价格: ¥${item.price}`"
                                                  :title="`${item.brand} ${item.model}`" />
                                </ListItem>
                            </template>
                        </List>
                    </div>

                    <div class="sub-module">
                        <h3>车辆详情</h3>
                        <Descriptions bordered :column="2">
                            <DescriptionItem label="品牌">
                                奥迪
                            </DescriptionItem>
                            <DescriptionItem label="型号">
                                A4L
                            </DescriptionItem>
                            <DescriptionItem label="年份">
                                2020
                            </DescriptionItem>
                            <DescriptionItem label="里程">
                                3万公里
                            </DescriptionItem>
                            <DescriptionItem label="发动机">
                                2.0T
                            </DescriptionItem>
                            <DescriptionItem label="变速箱">
                                自动
                            </DescriptionItem>
                            <DescriptionItem label="排量">
                                2.0L
                            </DescriptionItem>
                            <DescriptionItem label="车身状况">
                                良好
                            </DescriptionItem>
                        </Descriptions>
                    </div>

                    <div class="sub-module">
                        <h3>车辆编辑</h3>
                        <Form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                            <FormItem label="品牌">
                                <Input value="奥迪" />
                            </FormItem>
                            <FormItem label="型号">
                                <Input value="A4L" />
                            </FormItem>
                            <FormItem label="年份">
                                <Input value="2020" />
                            </FormItem>
                            <FormItem label="价格">
                                <Input value="250000" />
                            </FormItem>
                            <FormItem label="里程">
                                <Input value="30000" />
                            </FormItem>
                            <FormItem label="描述">
                                <Textarea value="车辆保养良好，无事故记录" />
                            </FormItem>
                            <FormItem :wrapper-col="{ offset: 6, span: 18 }">
                                <Button type="primary">
                                    保存
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </Card>

            <!-- 用户管理模块 -->
            <Card class="module-section" title="用户管理">
                <div class="module-content">
                    <div class="sub-module">
                        <h3>用户列表</h3>
                        <List :data-source="users"
                              item-layout="horizontal">
                            <template #renderItem="{ item }">
                                <ListItem>
                                    <ListItemMeta :avatar="h('img', { src: item.avatar, style: 'width: 50px; height: 50px; border-radius: 50%;' })"
                                                  :description="`邮箱: ${item.email} | 注册时间: ${item.registerDate}`"
                                                  :title="item.name" />
                                </ListItem>
                            </template>
                        </List>
                    </div>

                    <div class="sub-module">
                        <h3>用户详情</h3>
                        <Descriptions bordered :column="2">
                            <DescriptionItem label="姓名">
                                张三
                            </DescriptionItem>
                            <DescriptionItem label="邮箱">
                                zhangsan@example.com
                            </DescriptionItem>
                            <DescriptionItem label="电话">
                                13800138000
                            </DescriptionItem>
                            <DescriptionItem label="注册时间">
                                2023-01-01
                            </DescriptionItem>
                        </Descriptions>
                    </div>

                    <div class="sub-module">
                        <h3>用户权限管理</h3>
                        <div class="permission-management">
                            <CheckboxGroup v-model:value="userPermissions">
                                <Space direction="vertical">
                                    <Checkbox value="vehicle">
                                        车辆管理权限
                                    </Checkbox>
                                    <Checkbox value="user">
                                        用户管理权限
                                    </Checkbox>
                                    <Checkbox value="order">
                                        订单管理权限
                                    </Checkbox>
                                    <Checkbox value="stats">
                                        数据统计权限
                                    </Checkbox>
                                </Space>
                            </CheckboxGroup>
                        </div>
                    </div>
                </div>
            </Card>

            <!-- 订单管理模块 -->
            <Card class="module-section" title="订单管理">
                <div class="module-content">
                    <div class="sub-module">
                        <h3>订单列表</h3>
                        <Table :columns="orderColumns"
                               :data-source="orders"
                               :pagination="false">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.dataIndex === 'status'">
                                    <Tag :color="getStatusColor(record.status)">
                                        {{ record.statusText }}
                                    </Tag>
                                </template>
                                <template v-else-if="column.dataIndex === 'action'">
                                    <Space>
                                        <Button type="link">
                                            详情
                                        </Button>
                                        <Button type="link">
                                            编辑
                                        </Button>
                                    </Space>
                                </template>
                            </template>
                        </Table>
                    </div>

                    <div class="sub-module">
                        <h3>订单详情</h3>
                        <Descriptions bordered :column="2">
                            <DescriptionItem label="订单号">
                                ORD20230101001
                            </DescriptionItem>
                            <DescriptionItem label="下单时间">
                                2023-01-01 10:00:00
                            </DescriptionItem>
                            <DescriptionItem label="买家">
                                张三
                            </DescriptionItem>
                            <DescriptionItem label="卖家">
                                李四
                            </DescriptionItem>
                            <DescriptionItem label="品牌型号">
                                奥迪 A4L
                            </DescriptionItem>
                            <DescriptionItem label="年份">
                                2020
                            </DescriptionItem>
                            <DescriptionItem label="价格">
                                ¥250,000
                            </DescriptionItem>
                        </Descriptions>
                    </div>

                    <div class="sub-module">
                        <h3>订单状态跟踪</h3>
                        <Steps :current="2" :items="orderSteps" />
                    </div>
                </div>
            </Card>

            <!-- 数据统计模块 -->
            <Card class="module-section" title="数据统计">
                <div class="module-content">
                    <div class="sub-module">
                        <h3>销售统计</h3>
                        <div class="chart-container">
                            <div class="chart-placeholder">
                                <p>销售数据图表</p>
                            </div>
                        </div>
                    </div>

                    <div class="sub-module">
                        <h3>用户活跃度</h3>
                        <div class="chart-container">
                            <div class="chart-placeholder">
                                <p>用户活跃度图表</p>
                            </div>
                        </div>
                    </div>

                    <div class="sub-module">
                        <h3>车辆库存</h3>
                        <div class="chart-container">
                            <div class="chart-placeholder">
                                <p>车辆库存图表</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <!-- 系统设置模块 -->
            <Card class="module-section" title="系统设置">
                <div class="module-content">
                    <div class="sub-module">
                        <h3>基础设置</h3>
                        <Form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                            <FormItem label="系统名称">
                                <Input value="二手车交易系统" />
                            </FormItem>
                            <FormItem label="系统Logo">
                                <Upload>
                                    <Button>
                                        <UploadOutlined />
                                        选择文件
                                    </Button>
                                </Upload>
                            </FormItem>
                            <FormItem label="联系邮箱">
                                <Input value="admin@example.com" />
                            </FormItem>
                            <FormItem :wrapper-col="{ offset: 6, span: 18 }">
                                <Button type="primary">
                                    保存设置
                                </Button>
                            </FormItem>
                        </Form>
                    </div>

                    <div class="sub-module">
                        <h3>权限设置</h3>
                        <div class="permission-settings">
                            <div class="permission-group">
                                <h4>管理员权限</h4>
                                <CheckboxGroup v-model:value="adminPermissions">
                                    <Space direction="vertical">
                                        <Checkbox value="vehicle">
                                            车辆管理
                                        </Checkbox>
                                        <Checkbox value="user">
                                            用户管理
                                        </Checkbox>
                                        <Checkbox value="order">
                                            订单管理
                                        </Checkbox>
                                    </Space>
                                </CheckboxGroup>
                            </div>

                            <div class="permission-group">
                                <h4>普通用户权限</h4>
                                <CheckboxGroup v-model:value="userPermissions">
                                    <Space direction="vertical">
                                        <Checkbox value="vehicle">
                                            车辆管理
                                        </Checkbox>
                                        <Checkbox value="user">
                                            用户管理
                                        </Checkbox>
                                        <Checkbox value="order">
                                            订单管理
                                        </Checkbox>
                                    </Space>
                                </CheckboxGroup>
                            </div>
                        </div>
                    </div>

                    <div class="sub-module">
                        <h3>日志管理</h3>
                        <Timeline>
                            <TimelineItem color="green">
                                <p>2023-01-01 10:00:00</p>
                                <p>用户登录 - admin</p>
                            </TimelineItem>
                            <TimelineItem color="blue">
                                <p>2023-01-01 10:05:00</p>
                                <p>添加车辆 - admin</p>
                            </TimelineItem>
                            <TimelineItem color="red">
                                <p>2023-01-01 10:10:00</p>
                                <p>修改订单 - admin</p>
                            </TimelineItem>
                        </Timeline>
                    </div>
                </div>
            </Card>
        </div>
    </Page>
</template>

<script setup lang="ts">
import { h, ref } from "vue";

import { Page } from "@vben/common-ui";

import {
    Button,
    Card,
    Checkbox,
    CheckboxGroup,
    Descriptions,
    Form,
    FormItem,
    Input,
    List,
    ListItem,
    ListItemMeta,
    Space,
    Steps,
    Table,
    Tag,
    Textarea,
    Timeline,
    TimelineItem,
    Upload,
    UploadOutlined
} from "ant-design-vue";

// 车辆数据
const vehicles = ref([
    {
        id: 1,
        brand: "奥迪",
        model: "A4L",
        year: "2020",
        price: "250000",
        image: "https://via.placeholder.com/150x100"
    },
    {
        id: 2,
        brand: "宝马",
        model: "3系",
        year: "2019",
        price: "220000",
        image: "https://via.placeholder.com/150x100"
    },
    {
        id: 3,
        brand: "奔驰",
        model: "C级",
        year: "2021",
        price: "280000",
        image: "https://via.placeholder.com/150x100"
    }
]);

// 用户数据
const users = ref([
    {
        id: 1,
        name: "张三",
        email: "zhangsan@example.com",
        registerDate: "2023-01-01",
        avatar: "https://via.placeholder.com/50x50"
    },
    {
        id: 2,
        name: "李四",
        email: "lisi@example.com",
        registerDate: "2023-01-02",
        avatar: "https://via.placeholder.com/50x50"
    },
    {
        id: 3,
        name: "王五",
        email: "wangwu@example.com",
        registerDate: "2023-01-03",
        avatar: "https://via.placeholder.com/50x50"
    }
]);

// 订单数据
const orders = ref([
    {
        id: "ORD20230101001",
        vehicle: "奥迪 A4L",
        buyer: "张三",
        amount: "250000",
        status: "completed",
        statusText: "已完成"
    },
    {
        id: "ORD20230102002",
        vehicle: "宝马 3系",
        buyer: "李四",
        amount: "220000",
        status: "processing",
        statusText: "处理中"
    },
    {
        id: "ORD20230103003",
        vehicle: "奔驰 C级",
        buyer: "王五",
        amount: "280000",
        status: "pending",
        statusText: "待支付"
    }
]);

// 订单表格列定义
const orderColumns = [
    {
        title: "订单号",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "车辆",
        dataIndex: "vehicle",
        key: "vehicle",
    },
    {
        title: "买家",
        dataIndex: "buyer",
        key: "buyer",
    },
    {
        title: "金额",
        dataIndex: "amount",
        key: "amount",
    },
    {
        title: "状态",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "操作",
        dataIndex: "action",
        key: "action",
    },
];

// 订单状态步骤
const orderSteps = [
    {
        title: "下单",
        description: "2023-01-01 10:00",
    },
    {
        title: "支付",
        description: "2023-01-01 11:00",
    },
    {
        title: "过户",
        description: "2023-01-02 09:00",
        status: "process",
    },
    {
        title: "完成",
        description: "待完成",
    },
];

// 用户权限
const userPermissions = ref([ "vehicle", "user" ]);

// 管理员权限
const adminPermissions = ref([ "vehicle", "user", "order" ]);

// 获取状态颜色
const getStatusColor = (status: string) => {
    switch (status) {
        case "completed": {
            return "green";
        }
        case "pending": {
            return "orange";
        }
        case "processing": {
            return "blue";
        }
        default: {
            return "default";
        }
    }
};
</script>

<style scoped>


/* 响应式设计 */
@media (max-width: 768px) {
  .module-content {
    flex-direction: column;
  }

  .sub-module {
    min-width: 100%;
  }
}

.used-car-trading-system {
  min-height: 100vh;
  padding: 20px;
  background-color: hsl(var(--background));
}

.module-section {
  margin-bottom: 40px;
}

.module-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.sub-module {
  flex: 1;
  min-width: 300px;
  padding: 15px;
}

.sub-module h3 {
  padding-bottom: 10px;
  margin-top: 0;
  color: hsl(var(--foreground));
  border-bottom: 1px solid hsl(var(--border));
}

.permission-group {
  margin-bottom: 20px;
}

.permission-group h4 {
  margin: 0 0 10px;
  color: hsl(var(--foreground));
}

.chart-container {
  padding: 20px;
  text-align: center;
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) + 1px);
  box-shadow: 0 1px 3px hsl(var(--input) / 10%);
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: hsl(var(--muted) / 50%);
  border: 1px dashed hsl(var(--border));
  border-radius: calc(var(--radius) + 1px);
}
</style>
