<script setup>
import { CustomerService } from '@/service/CustomerService';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, ref } from 'vue';

const loading1 = ref(null);
const filters1 = ref(null);
const customers1 = ref(null);
const autoValue = ref(null);
const selectedAutoValue = ref(null);
const autoFilteredValue = ref([]);
const radioValue = ref(null);
const checkboxValue = ref([]);
const switchValue = ref(false);
const dropdownValues = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const dropdownValue = ref(null);
const multiselectValues = ref([
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
]);
const multiselectValue = ref(null);

function searchCountry(event) {
    setTimeout(() => {
        if (!event.query.trim().length) {
            autoFilteredValue.value = [...autoValue.value];
        } else {
            autoFilteredValue.value = autoValue.value.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
}

const toast = useToast();
const fileupload = ref();

function upload() {
    fileupload.value.upload();
}

function onUpload() {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

onBeforeMount(() => {
    CustomerService.getCustomersLarge().then((data) => {
        customers1.value = data;
        loading1.value = false;
        customers1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });
    initFilters1();
});

function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
}

function formatCurrency(value) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function getSeverity(status) {
    switch (status) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warn';

        case 'renewal':
            return null;
    }
}

function formatDate(value) {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-12">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">İkonlar</div>
                <div class="flex flex-wrap gap-2">
                    <Button icon="pi pi-check" rounded />
                    <Button icon="pi pi-bookmark" severity="secondary" rounded />
                    <Button icon="pi pi-search" severity="success" rounded />
                    <Button icon="pi pi-user" severity="info" rounded />
                    <Button icon="pi pi-bell" severity="warn" rounded />
                    <Button icon="pi pi-heart" severity="help" rounded />
                    <Button icon="pi pi-times" severity="danger" rounded />
                </div>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-12">
            <div class="card flex flex-col gap-4">
                <DataTable
                    :value="customers1"
                    :paginator="true"
                    :rows="10"
                    dataKey="id"
                    :rowHover="true"
                    v-model:filters="filters1"
                    filterDisplay="menu"
                    :loading="loading1"
                    :filters="filters1"
                    :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
                    showGridlines
                >
                    <template #header>
                        <div class="flex justify-between">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" />
                            </IconField>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column field="name" header="Name" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.name }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                        </template>
                    </Column>
                    <Column header="Country" filterField="country.name" style="min-width: 12rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px" />
                                <span>{{ data.country.name }}</span>
                            </div>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
                        </template>
                        <template #filterclear="{ filterCallback }">
                            <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                        </template>
                        <template #filterapply="{ filterCallback }">
                            <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                        </template>
                    </Column>
                    <Column header="Agent" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <img :alt="data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`" style="width: 32px" />
                                <span>{{ data.representative.name }}</span>
                            </div>
                        </template>
                        <template #filter="{ filterModel }">
                            <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Any">
                                <template #option="slotProps">
                                    <div class="flex items-center gap-2">
                                        <img :alt="slotProps.option.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`" style="width: 32px" />
                                        <span>{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                            </MultiSelect>
                        </template>
                    </Column>
                    <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatDate(data.date) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                        </template>
                    </Column>
                    <Column header="Balance" filterField="balance" dataType="numeric" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatCurrency(data.balance) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                        </template>
                    </Column>
                    <Column header="Status" field="status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                        <template #body="{ data }">
                            <Tag :value="data.status" :severity="getSeverity(data.status)" />
                        </template>
                        <template #filter="{ filterModel }">
                            <Select v-model="filterModel.value" :options="statuses" placeholder="Select One" showClear>
                                <template #option="slotProps">
                                    <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                                </template>
                            </Select>
                        </template>
                    </Column>
                    <Column field="activity" header="Activity" :showFilterMatchModes="false" style="min-width: 12rem">
                        <template #body="{ data }">
                            <ProgressBar :value="data.activity" :showValue="false" style="height: 6px"></ProgressBar>
                        </template>
                        <template #filter="{ filterModel }">
                            <Slider v-model="filterModel.value" range class="m-4"></Slider>
                            <div class="flex items-center justify-between px-2">
                                <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                                <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="verified" header="Verified" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                        <template #body="{ data }">
                            <i class="pi" :class="{ 'pi-check-circle text-green-500 ': data.verified, 'pi-times-circle text-red-500': !data.verified }"></i>
                        </template>
                        <template #filter="{ filterModel }">
                            <label for="verified-filter" class="font-bold"> Verified </label>
                            <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary inputId="verified-filter" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-12">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">İnputlar</div>
                <FloatLabel>
                    <InputText id="username" type="text" />
                    <label for="username">Username</label>
                </FloatLabel>
                <div class="font-semibold text-xl">Textarea</div>
                <Textarea placeholder="Your Message" :autoResize="true" rows="3" cols="30" />

                <div class="font-semibold text-xl">AutoComplete</div>
                <AutoComplete v-model="selectedAutoValue" :suggestions="autoFilteredValue" optionLabel="name" placeholder="Search" dropdown multiple display="chip" @complete="searchCountry($event)" />

                <div class="font-semibold text-xl">DatePicker</div>
                <DatePicker :showIcon="true" :showButtonBar="true"></DatePicker>

                <div class="font-semibold text-xl">InputNumber</div>
                <InputNumber showButtons mode="decimal"></InputNumber>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex items-center">
                        <RadioButton id="option1" name="option" value="Chicago" v-model="radioValue" />
                        <label for="option1" class="leading-none ml-2">Chicago</label>
                    </div>
                    <div class="flex items-center">
                        <RadioButton id="option2" name="option" value="Los Angeles" v-model="radioValue" />
                        <label for="option2" class="leading-none ml-2">Los Angeles</label>
                    </div>
                    <div class="flex items-center">
                        <RadioButton id="option3" name="option" value="New York" v-model="radioValue" />
                        <label for="option3" class="leading-none ml-2">New York</label>
                    </div>
                </div>

                <div class="font-semibold text-xl">Checkbox</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex items-center">
                        <Checkbox id="checkOption1" name="option" value="Chicago" v-model="checkboxValue" />
                        <label for="checkOption1" class="ml-2">Chicago</label>
                    </div>
                    <div class="flex items-center">
                        <Checkbox id="checkOption2" name="option" value="Los Angeles" v-model="checkboxValue" />
                        <label for="checkOption2" class="ml-2">Los Angeles</label>
                    </div>
                    <div class="flex items-center">
                        <Checkbox id="checkOption3" name="option" value="New York" v-model="checkboxValue" />
                        <label for="checkOption3" class="ml-2">New York</label>
                    </div>
                </div>

                <div class="font-semibold text-xl">ToggleSwitch</div>
                <ToggleSwitch v-model="switchValue" />

                <div class="font-semibold text-xl">Select</div>
                <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Select" />

                <div class="font-semibold text-xl">MultiSelect</div>
                <MultiSelect v-model="multiselectValue" :options="multiselectValues" optionLabel="name" placeholder="Select Countries" :filter="true">
                    <template #value="slotProps">
                        <div class="inline-flex items-center py-1 px-2 bg-primary text-primary-contrast rounded-border mr-2" v-for="option of slotProps.value" :key="option.code">
                            <span :class="'mr-2 flag flag-' + option.code.toLowerCase()" style="width: 18px; height: 12px" />
                            <div>{{ option.name }}</div>
                        </div>
                        <template v-if="!slotProps.value || slotProps.value.length === 0">
                            <div class="p-1">Select Countries</div>
                        </template>
                    </template>
                    <template #option="slotProps">
                        <div class="flex items-center">
                            <span :class="'mr-2 flag flag-' + slotProps.option.code.toLowerCase()" style="width: 18px; height: 12px" />
                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
                </MultiSelect>

                <div class="font-semibold text-xl mb-4">Advanced</div>
                <FileUpload name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload />
            </div>
        </div>
    </div>
</template>
