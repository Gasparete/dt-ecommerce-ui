import "./CustomerTable.css";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function CustomerTable({ customers, onRowClick, onDelete }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nome</TableCell>
          <TableCell>CPF</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>CEP</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {customers.map((c) => (
          <TableRow
            key={c.id}
            onClick={() => onRowClick(c)}
            className="clickable-row"
          >
            <TableCell>{c.person.name}</TableCell>
            <TableCell>{c.person.cpf}</TableCell>
            <TableCell>{c.email}</TableCell>
            <TableCell>{c.address.zipCode}</TableCell>
            <TableCell>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(c.id);
                }}
                variant="text"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Excluir
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
