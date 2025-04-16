"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CollapsibleCard } from "./ui/collapsible-card";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";

export interface CharacterClass {
  id: number;
  className: string;
  description: string;
  raceOptions: string[];
  nameOptions: Record<string, string[]>;
  lookOptions: Record<string, string[]>;
  stats: Record<string, string>;
  alignmentOptions: { alignment: string; trigger: string }[];
}

interface CharacterCreationFormProps {
  classes: CharacterClass[];
}

export function CharacterCreationForm({ classes }: CharacterCreationFormProps) {
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [race, setRace] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [look, setLook] = useState<Record<string, string>>({});
  const [assignedStats, setAssignedStats] = useState<Record<string, number>>(
    {},
  );
  const [alignment, setAlignment] = useState<string>("");

  const selectedClass = classes.find(
    (cls) => cls.className === selectedClassName,
  );

  const statNames = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Intelligence",
    "Wisdom",
    "Charisma",
  ];
  const statPool = [16, 15, 13, 12, 9, 8];

  const calculateHP = () => {
    const con = assignedStats["Constitution"] ?? 0;
    const base = parseInt(
      selectedClass?.stats?.hp_formula?.split("+")[0].trim() || "0",
    );
    return base + con;
  };

  const isComplete =
    selectedClassName &&
    race &&
    name &&
    alignment &&
    statNames.every((stat) => assignedStats[stat] != null) &&
    Object.keys(look).length ===
      Object.keys(selectedClass?.lookOptions || {}).length;

  const handleSubmit = async () => {
    if (!isComplete) return alert("Please complete all required fields.");

    const characterData = {
      className: selectedClassName,
      race,
      name,
      look,
      alignment,
      stats: assignedStats,
      maxHp: calculateHP(),
      damage_die: selectedClass?.stats.damage_die,
      level: 1,
    };

    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.log(error);
      return;
    }

    const payload = {
      userId: data.user.id,
      character_sheet: characterData,
    };

    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create character");

      const response = await res.json();
      console.log("Character created:", response);
      alert("Character created successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Create Your Character
      </h1>

      <CollapsibleCard title="General">
        <div className="flex flex-col gap-2">
          <Label>Class</Label>
          <Select
            value={selectedClassName || undefined}
            onValueChange={(value) => {
              setSelectedClassName(value);
              setRace("");
              setName("");
              setLook({});
              setAlignment("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.className} value={cls.className}>
                  {cls.className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClass?.description && (
          <div className="col-span-full text-sm text-muted-foreground leading-relaxed">
            <p>{selectedClass.description}</p>
          </div>
        )}

        {selectedClass && (
          <div className="flex flex-col gap-2">
            <Label>Race</Label>
            <Select
              onValueChange={(value) => {
                setRace(value);
                setName("");
              }}
              value={race || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select race" />
              </SelectTrigger>
              <SelectContent>
                {selectedClass.raceOptions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedClass && race && (
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Select onValueChange={setName} value={name || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select name" />
              </SelectTrigger>
              <SelectContent>
                {selectedClass.nameOptions[race]?.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CollapsibleCard>

      {selectedClass && (
        <CollapsibleCard title="Appearance">
          {Object.entries(selectedClass.lookOptions).map(
            ([category, options]) => (
              <div key={category} className="flex flex-col gap-2">
                <Label>{category}</Label>
                <Select
                  onValueChange={(value) =>
                    setLook((prev) => ({ ...prev, [category]: value }))
                  }
                  value={look[category] || undefined}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={`Select ${category.toLowerCase()}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ),
          )}
        </CollapsibleCard>
      )}

      {selectedClass && (
        <CollapsibleCard title="Stats">
          {statNames.map((stat) => (
            <div key={stat} className="flex flex-col gap-2">
              <Label>{stat}</Label>
              <Select
                onValueChange={(value) => {
                  setAssignedStats((prev) => {
                    const newStats = { ...prev };
                    if (value === "none") {
                      delete newStats[stat];
                      return newStats;
                    }
                    const parsed = parseInt(value);
                    const existingEntry = Object.entries(newStats).find(
                      ([k, v]) => v === parsed && k !== stat,
                    );
                    if (existingEntry) delete newStats[existingEntry[0]];
                    newStats[stat] = parsed;
                    return newStats;
                  });
                }}
                value={assignedStats[stat]?.toString() || "none"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  {statPool.map((val) => (
                    <SelectItem
                      key={val}
                      value={val.toString()}
                      disabled={
                        Object.values(assignedStats).includes(val) &&
                        assignedStats[stat] !== val
                      }
                    >
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <div className="col-span-full mt-4 text-sm text-muted-foreground">
            <p>
              <strong>Damage Die:</strong> {selectedClass.stats.damage_die}
            </p>
            <p>
              <strong>Max HP:</strong> {calculateHP()}
            </p>
          </div>
        </CollapsibleCard>
      )}

      {selectedClass && (
        <CollapsibleCard title="Alignment">
          <div className="space-y-4">
            <RadioGroup onValueChange={setAlignment} value={alignment}>
              {selectedClass.alignmentOptions.map((opt) => (
                <div key={opt.alignment} className="flex items-start space-x-3">
                  <RadioGroupItem value={opt.alignment} id={opt.alignment} />
                  <Label htmlFor={opt.alignment}>
                    {opt.alignment} – {opt.trigger}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CollapsibleCard>
      )}

      <div className="text-center">
        <Button onClick={handleSubmit} disabled={!isComplete} className="mt-4">
          Submit Character
        </Button>
      </div>

      <CollapsibleCard title="Debug Output">
        <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
          {JSON.stringify(
            {
              className: selectedClassName,
              race,
              name,
              look,
              alignment,
              stats: assignedStats,
              maxHp: selectedClass ? calculateHP() : 0,
              damage_die: selectedClass?.stats.damage_die,
              level: 1,
            },
            null,
            2,
          )}
        </pre>
      </CollapsibleCard>
    </div>
  );
}
