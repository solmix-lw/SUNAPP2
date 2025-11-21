
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { InsertEquipment } from "@shared/schema";

interface ImportPreviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    data: InsertEquipment[];
    isImporting: boolean;
}

export function ImportPreviewDialog({
    isOpen,
    onClose,
    onConfirm,
    data,
    isImporting,
}: ImportPreviewDialogProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const validateRow = (row: InsertEquipment) => {
        const missingFields = [];
        if (!row.equipmentType) missingFields.push("Type");
        if (!row.make) missingFields.push("Make");
        if (!row.model) missingFields.push("Model");
        return missingFields;
    };

    const validCount = data.filter((row) => validateRow(row).length === 0).length;
    const invalidCount = data.length - validCount;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Import Preview</DialogTitle>
                    <DialogDescription>
                        Review the data before importing. Found {data.length} items.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-4 py-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{validCount} Valid</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium">{invalidCount} Invalid</span>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden border rounded-md">
                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Make</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead>Plate No</TableHead>
                                    <TableHead>Asset No</TableHead>
                                    <TableHead>Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentData.map((row, index) => {
                                    const missing = validateRow(row);
                                    const isValid = missing.length === 0;
                                    return (
                                        <TableRow key={startIndex + index} className={!isValid ? "bg-destructive/5" : ""}>
                                            <TableCell>
                                                {isValid ? (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                        Valid
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">
                                                        Missing: {missing.join(", ")}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>{row.equipmentType || <span className="text-muted-foreground italic">Missing</span>}</TableCell>
                                            <TableCell>{row.make || <span className="text-muted-foreground italic">Missing</span>}</TableCell>
                                            <TableCell>{row.model || <span className="text-muted-foreground italic">Missing</span>}</TableCell>
                                            <TableCell>{row.plateNo || "-"}</TableCell>
                                            <TableCell>{row.assetNo || "-"}</TableCell>
                                            <TableCell>{row.price ? `$${row.price}` : "-"}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>

                <div className="flex items-center justify-between py-4">
                    <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} disabled={isImporting || validCount === 0}>
                        {isImporting ? "Importing..." : `Import ${validCount} Items`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
