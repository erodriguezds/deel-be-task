import { Table } from "react-bootstrap";


export default function DataTable({data, columns}){
    return (
        <Table striped>
            <thead>
                <tr>
                    {columns.map((col, i) => <th key={i}>{col.label}</th>)}
                </tr>
            </thead>
            <tbody>
                {(data || []).map((row, r) => <Row key={`row-${r+1}`} data={row} columns={columns} /> )}
            </tbody>
        </Table>
    );
}

function Row({data, columns}){
    return (
        <tr>
            {columns.map((col, c) => (
                <td key={`r${data.id}c${c+1}`}>
                    {
                        col.render ?
                        col.render(data) :
                        data[col.field]
                    }
                </td>
            ))}
        </tr>
    );
}