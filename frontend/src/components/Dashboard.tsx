"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

type Transaction = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  sold: boolean;
  dateOfSale: string;
};

type Statistics = {
  totalSaleAmount: number;
  soldItems: number;
  notSoldItems: number;
};

type BarChartData = {
  range: string;
  count: number;
};

const API_BASE_URL = "http://localhost:3000/api/";

export default function Component() {
  const [month, setMonth] = useState(3);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
  const [perPage] = useState(10);

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
  }, [month, searchText, page]);

    const fetchTransactions = async () => {
    const queryParams = new URLSearchParams({
      month: month.toString(),
      search: searchText,
      page: page.toString(),
      perPage: perPage.toString(),
    });

    try {
      const response = await fetch(`${API_BASE_URL}/transactions?${queryParams}`);
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  
  const fetchStatistics = async () => {
    const response = await fetch(`${API_BASE_URL}/statistics?month=${month}`);
    const data = await response.json();
    setStatistics(data);
  };

  const fetchBarChartData = async () => {
    const response = await fetch(`${API_BASE_URL}/barchart?month=${month}`);
    const data = await response.json();
    setBarChartData(data);
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Transaction Dashboard</h1>

      <div className="flex items-center space-x-4">
        <Select
          value={month.toString()}
          onValueChange={(value) => setMonth(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map(({ value, label }) => (
              <SelectItem key={value} value={value.toString()}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Search transactions"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>id</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Sold</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(transactions) ? ( // backend return differe if transactions is an array
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.title}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>${transaction.price.toFixed(2)}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>{transaction.sold ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>No transactions available</TableCell>{" "}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </Button>
            <Button onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {statistics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Total Sale Amount</h3>
                <p className="text-3xl font-bold">
                  ${statistics.totalSaleAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Total Sold Items</h3>
                <p className="text-3xl font-bold">{statistics.soldItems}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Total Not Sold Items</h3>
                <p className="text-3xl font-bold">{statistics.notSoldItems}</p>
              </div>
            </div>
          ) : (
            <p>Loading statistics...</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions Bar Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="range" />
              <YAxis ticks={[0, 2, 4, 6, 8, 10]} domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> 
    </div>
  );
}
