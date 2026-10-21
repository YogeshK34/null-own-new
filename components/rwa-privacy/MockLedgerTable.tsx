'use client';

import React from 'react';
import { TransferRecord } from '@/lib/rwa-privacy/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface MockLedgerTableProps {
  records: TransferRecord[];
  title?: string;
  subtitle?: string;
  highlightHash?: string;
}

export default function MockLedgerTable({
  records,
  title = 'Public Ledger & Block Explorer',
  subtitle = 'Real-time state transitions recorded on the immutable ledger',
  highlightHash,
}: MockLedgerTableProps) {
  return (
    <div className="my-6">
      <div className="mb-3 flex items-end justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-[800] uppercase tracking-[-0.02em]">{title}</h3>
          <p className="font-mono text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <Badge variant="default" className="text-xs">
          {records.length} TRANSACTIONS
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>TX HASH</TableHead>
            <TableHead>BLOCK</TableHead>
            <TableHead>FROM (SENDER)</TableHead>
            <TableHead>TO (RECIPIENT)</TableHead>
            <TableHead>ASSET / VALUE</TableHead>
            <TableHead>PRIVACY STATUS</TableHead>
            <TableHead>TIMESTAMP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((item, idx) => {
            const isHighlighted = highlightHash === item.txHash;
            return (
              <TableRow
                key={item.txHash || idx}
                className={
                  isHighlighted
                    ? "bg-[#FFDD00]/30 outline-2 outline-black border-b-2 border-black"
                    : undefined
                }
              >
                <TableCell>
                  <code
                    className="font-mono text-xs border-2 border-black bg-black text-[#00C853] px-1.5 py-0.5 inline-block"
                    title={item.txHash}
                  >
                    {item.txHash.slice(0, 10)}...{item.txHash.slice(-6)}
                  </code>
                </TableCell>
                <TableCell className="font-mono text-xs font-bold">
                  #{item.blockNumber}
                </TableCell>
                <TableCell>
                  <code
                    className="font-mono text-xs border border-black bg-white dark:bg-black px-1.5 py-0.5 inline-block"
                    title={item.fromAddress}
                  >
                    {item.fromAddress.slice(0, 8)}...{item.fromAddress.slice(-6)}
                  </code>
                </TableCell>
                <TableCell>
                  <code
                    className={`font-mono text-xs border border-black px-1.5 py-0.5 inline-block font-bold ${
                      item.isPrivate
                        ? "bg-black text-[#00C853]"
                        : "bg-black text-[#FF2D2D]"
                    }`}
                    title={item.toAddress}
                  >
                    {item.toAddress.slice(0, 8)}...{item.toAddress.slice(-6)}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="font-bold">{item.assetName}</div>
                  <div className="text-xs font-mono text-muted-foreground">
                    ${item.value.toLocaleString()} USD ({item.assetType})
                  </div>
                </TableCell>
                <TableCell>
                  {item.isPrivate ? (
                    <Badge variant="success">✓ STEALTH (ANONYMOUS)</Badge>
                  ) : (
                    <Badge variant="destructive">⚠ PUBLIC (DOXXED)</Badge>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                  {item.timestamp}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
