import { calculateBatchEconomics } from './calculator';

export const SAMPLE_BATCH_PRESETS = [
  {
    id: 'preset_mango_jam',
    productName: 'Premium Mango Jam',
    productCategory: 'Preserves & Jams',
    batchQuantity: 1000,
    unitOfMeasure: 'kg',
    sellingPricePerUnit: 160,
    packagingCost: 18000,
    labourCost: 12000,
    energyCost: 6500,
    waterUtilitiesCost: 1500,
    transportLogisticsCost: 4000,
    overheadCost: 10000,
    wastagePercentage: 6.5,
    ingredients: [
      { name: 'Mango Pulp (Alphonso)', quantity: 550, unit: 'kg', unitPrice: 85 },
      { name: 'Refined Sugar', quantity: 420, unit: 'kg', unitPrice: 42 },
      { name: 'Pectin (Fruit Grade)', quantity: 8, unit: 'kg', unitPrice: 750 },
      { name: 'Citric Acid', quantity: 4, unit: 'kg', unitPrice: 180 }
    ]
  },
  {
    id: 'preset_tomato_sauce',
    productName: 'Classic Tomato Ketchup',
    productCategory: 'Sauces & Condiments',
    batchQuantity: 2000,
    unitOfMeasure: 'kg',
    sellingPricePerUnit: 110,
    packagingCost: 24000,
    labourCost: 18000,
    energyCost: 11000,
    waterUtilitiesCost: 2500,
    transportLogisticsCost: 7500,
    overheadCost: 15000,
    wastagePercentage: 4.8,
    ingredients: [
      { name: 'Tomato Concentrate (28 Brix)', quantity: 1200, unit: 'kg', unitPrice: 52 },
      { name: 'Liquid Glucose & Sugar', quantity: 650, unit: 'kg', unitPrice: 40 },
      { name: 'Vinegar (4% Acidity)', quantity: 110, unit: 'kg', unitPrice: 22 },
      { name: 'Salt & Spices Blend', quantity: 40, unit: 'kg', unitPrice: 65 }
    ]
  },
  {
    id: 'preset_butter_biscuit',
    productName: 'Crispy Butter Biscuits',
    productCategory: 'Bakery & Confectionery',
    batchQuantity: 500,
    unitOfMeasure: 'kg',
    sellingPricePerUnit: 220,
    packagingCost: 12000,
    labourCost: 14000,
    energyCost: 9500,
    waterUtilitiesCost: 1200,
    transportLogisticsCost: 3500,
    overheadCost: 9000,
    wastagePercentage: 3.2,
    ingredients: [
      { name: 'Refined Wheat Flour (Maida)', quantity: 260, unit: 'kg', unitPrice: 32 },
      { name: 'Pure Dairy Butter', quantity: 110, unit: 'kg', unitPrice: 420 },
      { name: 'Icing Sugar', quantity: 115, unit: 'kg', unitPrice: 45 },
      { name: 'Baking Powder & Emulsifiers', quantity: 15, unit: 'kg', unitPrice: 120 }
    ]
  },
  {
    id: 'preset_tropical_juice',
    productName: 'Tropical Multi-Fruit Juice',
    productCategory: 'Beverages',
    batchQuantity: 5000,
    unitOfMeasure: 'L',
    sellingPricePerUnit: 68,
    packagingCost: 45000,
    labourCost: 22000,
    energyCost: 18000,
    waterUtilitiesCost: 4000,
    transportLogisticsCost: 16000,
    overheadCost: 28000,
    wastagePercentage: 2.5,
    ingredients: [
      { name: 'Reconstituted Fruit Juice Concentrate', quantity: 3800, unit: 'L', unitPrice: 35 },
      { name: 'Cane Sugar Syrup', quantity: 800, unit: 'L', unitPrice: 28 },
      { name: 'Vitamin C & Ascorbic Acid', quantity: 15, unit: 'kg', unitPrice: 450 },
      { name: 'Purified Deionized Water Base', quantity: 400, unit: 'L', unitPrice: 2 }
    ]
  },
  {
    id: 'preset_mango_pickle',
    productName: 'Spicy Raw Mango Pickle',
    productCategory: 'Pickles & Spices',
    batchQuantity: 300,
    unitOfMeasure: 'kg',
    sellingPricePerUnit: 280,
    packagingCost: 9500,
    labourCost: 8000,
    energyCost: 3200,
    waterUtilitiesCost: 800,
    transportLogisticsCost: 2500,
    overheadCost: 5500,
    wastagePercentage: 5.0,
    ingredients: [
      { name: 'Diced Green Raw Mango', quantity: 180, unit: 'kg', unitPrice: 45 },
      { name: 'Mustard Oil (Cold Pressed)', quantity: 65, unit: 'kg', unitPrice: 165 },
      { name: 'Red Chili & Fenugreek Spice Mix', quantity: 40, unit: 'kg', unitPrice: 180 },
      { name: 'Iodized Salt', quantity: 20, unit: 'kg', unitPrice: 15 }
    ]
  }
];

export function getInitialSampleBatches() {
  return SAMPLE_BATCH_PRESETS.map((p, idx) => {
    const eco = calculateBatchEconomics(p);
    return {
      ...p,
      id: `batch_demo_${idx + 1}`,
      economics: eco,
      createdAt: new Date(Date.now() - (idx * 86400000 * 3)).toISOString()
    };
  });
}
