import { Table } from "react-bootstrap";


export default function DataTable({data, columns}){
    const visible = columns.filter(col => col.visible !== false);

    return (
        <Table striped>
            <thead>
                <tr>
                    {visible.map((col, i) => <th key={i}>{col.label}</th>)}
                </tr>
            </thead>
            <tbody>
                {(data || []).map((row, r) => <Row key={`row-${r+1}`} data={row} columns={visible} /> )}
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