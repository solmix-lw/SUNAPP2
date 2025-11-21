/**
 * Patch script to update EquipmentCategory.tsx
 * Adds missing fields to match Equipment.tsx add dialog
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '..', 'client', 'src', 'pages', 'EquipmentCategory.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add Textarea import
content = content.replace(
    `import { Label } from "@/components/ui/label";`,
    `import { Label } from "@/components/ui/label";\nimport { Textarea } from "@/components/ui/textarea";`
);

// 2. Add Employee to type imports
content = content.replace(
    `import type {\n  Equipment,\n  EquipmentCategory,\n  MaintenanceRecordWithDetails,`,
    `import type {\n  Equipment,\n  EquipmentCategory,\n  Employee,\n  MaintenanceRecordWithDetails,`
);

// 3. Update formData state to include new fields
content = content.replace(
    `machineSerial: "",\n    remarks: "",\n  });`,
    `machineSerial: "",\n    engineNumber: "",\n    projectArea: "",\n    price: null as string | null,\n    assignedDriverId: null as string | null,\n    remarks: "",\n  });`
);

// 4. Add driver selection state after categoryFormData
content = content.replace(
    `const [categoryFormData, setCategoryFormData] = useState({\n    name: "",\n    description: "",\n    backgroundImage: "",\n  });`,
    `const [categoryFormData, setCategoryFormData] = useState({\n    name: "",\n    description: "",\n    backgroundImage: "",\n  });\n  const [selectedDriver, setSelectedDriver] = useState<Employee | null>(null);\n  const [driverDialogOpen, setDriverDialogOpen] = useState(false);\n  const [driverSearchTerm, setDriverSearchTerm] = useState("");`
);

// 5. Add Employee query after categories query
content = content.replace(
    `const { data: categories } = useQuery<EquipmentCategory[]>({\n    queryKey: ["/api/equipment-categories"],\n  });`,
    `const { data: categories } = useQuery<EquipmentCategory[]>({\n    queryKey: ["/api/equipment-categories"],\n  });\n\n  const { data: employees } = useQuery<Employee[]>({\n    queryKey: ["/api/employees"],\n  });`
);

// 6. Update resetForm to include new fields
content = content.replace(
    `machineSerial: "",\n      remarks: "",\n    });\n  };`,
    `machineSerial: "",\n      engineNumber: "",\n      projectArea: "",\n      price: null,\n      assignedDriverId: null,\n      remarks: "",\n    });\n    setSelectedDriver(null);\n  };`
);

// 7. Update handleEdit to include new fields and driver logic
content = content.replace(
    `machineSerial: equipment.machineSerial || "",\n      remarks: equipment.remarks || "",\n    });\n    setIsEditDialogOpen(true);\n  };`,
    `machineSerial: equipment.machineSerial || "",\n      engineNumber: equipment.engineNumber || "",\n      projectArea: equipment.projectArea || "",\n      price: (equipment.price as string | null) || null,\n      assignedDriverId: equipment.assignedDriverId || null,\n      remarks: equipment.remarks || "",\n    });\n\n    // Find and set the assigned driver\n    if (equipment.assignedDriverId && employees) {\n      const driver = employees.find(emp => emp.id === equipment.assignedDriverId);\n      setSelectedDriver(driver || null);\n    } else {\n      setSelectedDriver(null);\n    }\n\n    setIsEditDialogOpen(true);\n  };`
);

// 8. Add handleDriverSelect function after handleCategorySubmit
content = content.replace(
    `const handleCategorySubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    if (matchedCategory) {\n      updateCategoryMutation.mutate({ id: matchedCategory.id, category: categoryFormData });\n    }\n  };`,
    `const handleCategorySubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    if (matchedCategory) {\n      updateCategoryMutation.mutate({ id: matchedCategory.id, category: categoryFormData });\n    }\n  };\n\n  const handleDriverSelect = (driver: Employee) => {\n    setSelectedDriver(driver);\n    setFormData({\n      ...formData,\n      assignedDriverId: driver.id,\n    });\n    setDriverDialogOpen(false);\n    setDriverSearchTerm("");\n  };`
);

// 9. Update the edit dialog form fields (add new fields before remarks)
const oldFormFields = `              <div className="space-y-2">
                <Label htmlFor="machineSerial">Machine Serial</Label>
                <Input
                  id="machineSerial"
                  value={formData.machineSerial || ""}
                  onChange={(e) => setFormData({ ...formData, machineSerial: e.target.value })}
                  placeholder="e.g., SN-123456"
                  data-testid="input-machine-serial"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  value={formData.remarks || ""}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Additional notes"
                  data-testid="input-remarks"
                />
              </div>`;

const newFormFields = `              <div className="space-y-2">
                <Label htmlFor="machineSerial">Machine Serial</Label>
                <Input
                  id="machineSerial"
                  value={formData.machineSerial || ""}
                  onChange={(e) => setFormData({ ...formData, machineSerial: e.target.value })}
                  placeholder="e.g., CAT12345X"
                  data-testid="input-machine-serial"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engineNumber">Engine Number</Label>
                <Input
                  id="engineNumber"
                  value={formData.engineNumber || ""}
                  onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                  placeholder="e.g., 41Z21282"
                  data-testid="input-engine-number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectArea">Project Area</Label>
                <Input
                  id="projectArea"
                  value={formData.projectArea || ""}
                  onChange={(e) => setFormData({ ...formData, projectArea: e.target.value })}
                  placeholder="e.g., Site A, Zone 3"
                  data-testid="input-project-area"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value === "" ? null : e.target.value,
                    })
                  }
                  placeholder="e.g., 250000"
                  data-testid="input-price"
                />
              </div>

              <div className="space-y-2">
                <Label>Assigned Driver</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setDriverDialogOpen(true)}
                  data-testid="button-select-assigned-driver"
                >
                  {selectedDriver ? (
                    <span className="truncate">
                      {selectedDriver.fullName} ({selectedDriver.employeeId})
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Click to Select Driver</span>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks || ""}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Additional notes or comments"
                rows={3}
                data-testid="textarea-remarks"
              />
            </div>`;

content = content.replace(oldFormFields, newFormFields);

// 10. Add driver selection dialog after edit equipment dialog
const dialogInsertPoint = `      </Dialog>

      {/* Delete Equipment Confirmation Dialog */}`;

const driverDialog = `      </Dialog>

      {/* Driver Selection Dialog */}
      <Dialog open={driverDialogOpen} onOpenChange={setDriverDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Assigned Driver</DialogTitle>
            <DialogDescription>
              Choose the driver to assign to this equipment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Search by name, ID, or role..."
              value={driverSearchTerm}
              onChange={(e) => setDriverSearchTerm(e.target.value)}
              data-testid="input-search-driver"
            />

            <div className="border rounded-lg max-h-[400px] overflow-y-auto">
              <div className="divide-y">
                {employees
                  ?.filter((emp) => {
                    if (!driverSearchTerm) return true;
                    const searchLower = driverSearchTerm.toLowerCase();
                    return (
                      emp.fullName.toLowerCase().includes(searchLower) ||
                      emp.employeeId?.toLowerCase().includes(searchLower) ||
                      emp.role?.toLowerCase().includes(searchLower)
                    );
                  })
                  .map((driver) => (
                    <div
                      key={driver.id}
                      className="p-4 hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handleDriverSelect(driver)}
                      data-testid={\`driver-option-\${driver.id}\`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{driver.fullName}</div>
                          <div className="text-sm text-muted-foreground">
                            {driver.employeeId} • {driver.role || "No role"}
                          </div>
                        </div>
                        {selectedDriver?.id === driver.id && (
                          <Badge>Selected</Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Equipment Confirmation Dialog */}`;

content = content.replace(dialogInsertPoint, driverDialog);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf-8');

console.log('✅ Successfully patched EquipmentCategory.tsx');
