import React, {Component} from 'react';
import {connect} from 'react-redux';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import ReactJson from 'react-json-view';
import Countries from 'country-list';
import {ListGroup, ListGroupItem} from 'reactstrap';

function make_populate_incident(data) {
    return {
        type: 'POPULATE_INCIDENT',
        data: data
    };
}

function make_populate_wikidata(data) {
    return {
        type: 'POPULATE_WIKIDATA',
        data: data
    };
}

class AnomalyIncidentWidget extends Component {
    constructor(props) {
        super(props);

        this.handle_load = props.handle_load.bind(this);
    }

    componentDidMount() {
        this.handle_load();
    }

    incident_get_date() {
        let date = this.props.incident[this.props.match.params.measurement_id]
            ? new Date(
                  `${
                      (
                          this.props.incident[
                              this.props.match.params.measurement_id
                          ] || {}
                      ).measurement_start_time
                  }Z`
              )
            : new Date();

        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    incident_get_country() {
        return (
            this.props.incident[this.props.match.params.measurement_id] || {}
        ).probe_cc;
    }

    parameter_get_table() {
        let data = [
            {
                parameter: 'input',
                value:
                    (
                        this.props.incident[
                            this.props.match.params.measurement_id
                        ] || {}
                    ).input || 'n/a'
            },
            {
                parameter: 'date',
                value: this.incident_get_date()
            },
            {
                parameter: 'country',
                value:
                    (this.incident_get_country() &&
                        Countries().getName(this.incident_get_country())) ||
                    'n/a'
            },
            {
                parameter: 'measurement_id',
                value: this.props.match.params.measurement_id
            }
        ];

        return (
            <div key="parameter">
                <h3>Parameters</h3>
                <DataTable value={data}>
                    <Column
                        key="parameter"
                        field="parameter"
                        header="Parameter"
                    />
                    <Column key="value" field="value" header="Value" />
                </DataTable>
            </div>
        );
    }

    event_get_list() {
        let event_list =
            (this.props.wikidata[this.incident_get_country()] || {})[
                this.incident_get_date()
            ] || [];

        return (
            (event_list.length > 0 && (
                <ListGroup>
                    {event_list.map(event => (
                        <ListGroupItem key={event.link} href={event.link}>
                            {event.label}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            )) ||
            this.event_empty_list()
        );
    }

    event_empty_list() {
        return <p>No data from wikidata</p>;
    }

    blocking_get_cause() {
        return (
            (
                (
                    this.props.incident[
                        this.props.match.params.measurement_id
                    ] || {}
                ).test_keys || {}
            ).blocking || 'non-deducible'
        );
    }

    render() {
        return (
            <div>
                <h2>
                    Anomaly report for measurement{' '}
                    {this.props.match.params.measurement_id}
                </h2>

                <div key="parameters">{this.parameter_get_table()}</div>

                <div>
                    <h3>Method for blocking</h3>
                    <p>
                        Most probable method of blocking:{' '}
                        <strong>{this.blocking_get_cause()}</strong>
                    </p>
                </div>

                <div key="events">
                    <h3>Notable events</h3>
                    {this.event_get_list()}
                </div>

                <div key="measurements">
                    <h3>Anomaly details</h3>
                    <ReactJson
                        collapsed="2"
                        src={
                            this.props.incident[
                                this.props.match.params.measurement_id
                            ] || {}
                        }
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        incident: state.incident || {},
        wikidata: state.wikidata || {}
    }),
    dispatch => ({
        handle_load() {
            let [measurement_date, wikidata_date] = [new Date(), new Date()];

            this.props.delegate_loading_reset();

            this.props.delegate_loading_populate(measurement_date);
            fetch(
                `https://api.ooni.io/api/v1/measurement/${
                    this.props.match.params.measurement_id
                }`
            )
                .then(response => response.json())
                .then(data => {
                    dispatch(
                        make_populate_incident({
                            [this.props.match.params.measurement_id]: data
                        })
                    );
                    this.props.delegate_loading_done(measurement_date);

                    this.props.delegate_loading_populate(wikidata_date);
                    fetch(
                        `https://query.wikidata.org/sparql?query=PREFIX%20xsd%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0A%0ASELECT%20%3Fevent%20%3FeventLabel%20%3FcountryCode%20%3Fdate%20WHERE%20%7B%0A%20%20%3Fevent%20(wdt%3AP31%2Fwdt%3AP279*)%20wd%3AQ1190554.%0A%20%20%7B%20%3Fevent%20wdt%3AP585%20%3Fdate.%20%7D%20UNION%20%7B%20%3Fevent%20wdt%3AP580%20%3Fdate.%20%7D%0A%20%20%3Fevent%20rdfs%3Alabel%20%3FeventLabel.%0A%20%20%3Fevent%20wdt%3AP17%20%3Fcountry.%0A%20%20%3Fcountry%20wdt%3AP297%20%3FcountryCode.%0A%20%20FILTER(%3Fdate%20%3D%20%22${this.incident_get_date()}%22%5E%5Exsd%3AdateTime)%0A%20%20FILTER(%3FcountryCode%20%3D%20%22${this.incident_get_country().toUpperCase()}%22)%0A%7D%0ALIMIT%2010`
                    )
                        .then(response => response.json())
                        .then(data => {
                            dispatch(
                                make_populate_wikidata({
                                    [this.incident_get_country()]: {
                                        [this.incident_get_date()]: (
                                            (data.results || {}).bindings || []
                                        ).map(incoming => ({
                                            link: incoming.event.value,
                                            label: incoming.eventLabel.value
                                        }))
                                    }
                                })
                            );
                            this.props.delegate_loading_done(wikidata_date);
                        });
                });
        }
    })
)(AnomalyIncidentWidget);
