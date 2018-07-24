import React, {Component} from 'react';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';

import {Card} from 'primereact/card';
import {Chart} from 'primereact/components/chart/Chart';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';

class App extends Component {
    render() {
        const data_radar = {
            labels: [
                'Eating',
                'Drinking',
                'Sleeping',
                'Designing',
                'Coding',
                'Cycling',
                'Running'
            ],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(179,181,198,0.2)',
                    borderColor: 'rgba(179,181,198,1)',
                    pointBackgroundColor: 'rgba(179,181,198,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(179,181,198,1)',
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        };
        const data_table = {
            data: [
                {brand: 'VW', year: 2012, color: 'Orange', vin: 'dsad231ff'},
                {brand: 'Audi', year: 2011, color: 'Black', vin: 'gwregre345'},
                {brand: 'Renault', year: 2005, color: 'Gray', vin: 'h354htr'},
                {brand: 'BMW', year: 2003, color: 'Blue', vin: 'j6w54qgh'},
                {
                    brand: 'Mercedes',
                    year: 1995,
                    color: 'Orange',
                    vin: 'hrtwy34'
                },
                {brand: 'Volvo', year: 2005, color: 'Black', vin: 'jejtyj'},
                {brand: 'Honda', year: 2012, color: 'Yellow', vin: 'g43gr'},
                {brand: 'Jaguar', year: 2013, color: 'Orange', vin: 'greg34'},
                {brand: 'Ford', year: 2000, color: 'Black', vin: 'h54hw5'},
                {brand: 'Fiat', year: 2013, color: 'Red', vin: '245t2s'}
            ]
        };

        return (
            <div className="ui-g">
                <div className="ui-g-2" />
                <div className="ui-g-8">
                    <Card title="PrimeReact" subTitle="Radar Chart Demo">
                        <Chart type="radar" data={data_radar} />
                    </Card>

                    <Card title="PrimeReact" subTitle="Data Table Demo">
                        <DataTable value={data_table.data}>
                            <Column field="vin" header="Vin" />
                            <Column field="year" header="Year" />
                            <Column field="brand" header="Brand" />
                            <Column field="color" header="Color" />
                        </DataTable>
                    </Card>
                </div>
            </div>
        );
    }
}

export default App;
