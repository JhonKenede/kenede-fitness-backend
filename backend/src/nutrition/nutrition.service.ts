import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface Food { name: string; quantity: string; calories: number; protein: number; carbs: number; fat: number; }
export interface Meal { name: string; time: string; calories: number; protein: number; carbs: number; fat: number; foods: Food[]; }

@Injectable()
export class NutritionService {
  constructor(private prisma: PrismaService) {}

  async getPlan(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });

    const weight = profile?.weight ?? 75;
    const height = profile?.height ?? 175;
    const age = profile?.age ?? 25;
    const goal = profile?.goal ?? 'MAINTENANCE';
    const level = profile?.level ?? 'BEGINNER';

    // TMB Mifflin-St Jeor (género neutro)
    const bmr = Math.round((10 * weight) + (6.25 * height) - (5 * age));

    // TDEE según nivel
    const activityMap: Record<string, number> = { BEGINNER: 1.375, INTERMEDIATE: 1.55, ADVANCED: 1.725 };
    const tdee = Math.round(bmr * (activityMap[level] ?? 1.375));

    // Ajuste por objetivo
    const goalAdjust: Record<string, number> = { DEFINITION: -400, VOLUME: 400, MAINTENANCE: 0 };
    const calories = tdee + (goalAdjust[goal] ?? 0);

    // Macros
    const proteinMultiplier: Record<string, number> = { DEFINITION: 2.5, VOLUME: 2.2, MAINTENANCE: 2.0 };
    const protein = Math.round(weight * (proteinMultiplier[goal] ?? 2.0));
    const fat = Math.round((calories * 0.25) / 9);
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

    const meals = this.buildMealPlan(goal as string, calories, protein, carbs, fat);
    const tips = this.getTips(goal as string);

    return { calories, protein, carbs, fat, bmr, tdee, goal, meals, tips };
  }

  private buildMealPlan(goal: string, cal: number, prot: number, carbs: number, fat: number): Meal[] {
    // Distribución: 25% desayuno, 15% media mañana, 35% comida, 10% merienda, 15% cena
    const dist = [0.25, 0.15, 0.35, 0.10, 0.15];

    if (goal === 'VOLUME') {
      return [
        { name: 'Desayuno', time: '08:00', calories: Math.round(cal * dist[0]),
          protein: Math.round(prot * dist[0]), carbs: Math.round(carbs * dist[0]), fat: Math.round(fat * dist[0]),
          foods: [
            { name: 'Avena', quantity: '100g', calories: 389, protein: 17, carbs: 66, fat: 7 },
            { name: 'Leche entera', quantity: '300ml', calories: 195, protein: 10, carbs: 14, fat: 10 },
            { name: 'Plátano', quantity: '1 grande', calories: 120, protein: 1, carbs: 31, fat: 0 },
            { name: 'Mantequilla de cacahuete', quantity: '20g', calories: 118, protein: 5, carbs: 3, fat: 10 },
          ] },
        { name: 'Media mañana', time: '11:00', calories: Math.round(cal * dist[1]),
          protein: Math.round(prot * dist[1]), carbs: Math.round(carbs * dist[1]), fat: Math.round(fat * dist[1]),
          foods: [
            { name: 'Batido de proteínas', quantity: '1 scoop (30g)', calories: 120, protein: 25, carbs: 5, fat: 2 },
            { name: 'Manzana', quantity: '1 mediana', calories: 80, protein: 0, carbs: 21, fat: 0 },
            { name: 'Almendras', quantity: '25g', calories: 145, protein: 5, carbs: 5, fat: 13 },
          ] },
        { name: 'Comida', time: '14:00', calories: Math.round(cal * dist[2]),
          protein: Math.round(prot * dist[2]), carbs: Math.round(carbs * dist[2]), fat: Math.round(fat * dist[2]),
          foods: [
            { name: 'Pechuga de pollo', quantity: '200g', calories: 330, protein: 62, carbs: 0, fat: 7 },
            { name: 'Arroz blanco', quantity: '150g cocido', calories: 195, protein: 4, carbs: 42, fat: 0 },
            { name: 'Brócoli', quantity: '200g', calories: 68, protein: 6, carbs: 13, fat: 0 },
            { name: 'Aceite de oliva', quantity: '15ml', calories: 135, protein: 0, carbs: 0, fat: 15 },
          ] },
        { name: 'Merienda', time: '17:30', calories: Math.round(cal * dist[3]),
          protein: Math.round(prot * dist[3]), carbs: Math.round(carbs * dist[3]), fat: Math.round(fat * dist[3]),
          foods: [
            { name: 'Yogur griego', quantity: '200g', calories: 130, protein: 20, carbs: 8, fat: 2 },
            { name: 'Frutos rojos', quantity: '100g', calories: 50, protein: 1, carbs: 12, fat: 0 },
            { name: 'Nueces', quantity: '20g', calories: 130, protein: 3, carbs: 3, fat: 13 },
          ] },
        { name: 'Cena', time: '20:30', calories: Math.round(cal * dist[4]),
          protein: Math.round(prot * dist[4]), carbs: Math.round(carbs * dist[4]), fat: Math.round(fat * dist[4]),
          foods: [
            { name: 'Salmón', quantity: '180g', calories: 350, protein: 40, carbs: 0, fat: 20 },
            { name: 'Patata dulce', quantity: '150g', calories: 130, protein: 2, carbs: 30, fat: 0 },
            { name: 'Ensalada mixta', quantity: '150g', calories: 35, protein: 2, carbs: 7, fat: 0 },
          ] },
      ];
    }

    if (goal === 'DEFINITION') {
      return [
        { name: 'Desayuno', time: '07:30', calories: Math.round(cal * dist[0]),
          protein: Math.round(prot * dist[0]), carbs: Math.round(carbs * dist[0]), fat: Math.round(fat * dist[0]),
          foods: [
            { name: 'Claras de huevo', quantity: '6 claras', calories: 100, protein: 22, carbs: 1, fat: 0 },
            { name: 'Avena', quantity: '60g', calories: 233, protein: 10, carbs: 40, fat: 4 },
            { name: 'Arándanos', quantity: '100g', calories: 57, protein: 1, carbs: 14, fat: 0 },
          ] },
        { name: 'Media mañana', time: '10:30', calories: Math.round(cal * dist[1]),
          protein: Math.round(prot * dist[1]), carbs: Math.round(carbs * dist[1]), fat: Math.round(fat * dist[1]),
          foods: [
            { name: 'Batido de proteínas', quantity: '1 scoop (30g)', calories: 120, protein: 25, carbs: 5, fat: 2 },
            { name: 'Pepino', quantity: '200g', calories: 30, protein: 1, carbs: 7, fat: 0 },
          ] },
        { name: 'Comida', time: '13:30', calories: Math.round(cal * dist[2]),
          protein: Math.round(prot * dist[2]), carbs: Math.round(carbs * dist[2]), fat: Math.round(fat * dist[2]),
          foods: [
            { name: 'Pechuga de pollo', quantity: '220g', calories: 363, protein: 68, carbs: 0, fat: 8 },
            { name: 'Arroz integral', quantity: '100g cocido', calories: 110, protein: 3, carbs: 23, fat: 1 },
            { name: 'Espinacas salteadas', quantity: '200g', calories: 46, protein: 6, carbs: 7, fat: 0 },
            { name: 'Aceite de oliva', quantity: '10ml', calories: 90, protein: 0, carbs: 0, fat: 10 },
          ] },
        { name: 'Merienda', time: '17:00', calories: Math.round(cal * dist[3]),
          protein: Math.round(prot * dist[3]), carbs: Math.round(carbs * dist[3]), fat: Math.round(fat * dist[3]),
          foods: [
            { name: 'Atún al natural', quantity: '120g', calories: 130, protein: 28, carbs: 0, fat: 2 },
            { name: 'Tomate cherry', quantity: '150g', calories: 27, protein: 1, carbs: 6, fat: 0 },
          ] },
        { name: 'Cena', time: '20:00', calories: Math.round(cal * dist[4]),
          protein: Math.round(prot * dist[4]), carbs: Math.round(carbs * dist[4]), fat: Math.round(fat * dist[4]),
          foods: [
            { name: 'Merluza al horno', quantity: '200g', calories: 180, protein: 38, carbs: 0, fat: 3 },
            { name: 'Verduras asadas', quantity: '250g', calories: 85, protein: 3, carbs: 18, fat: 0 },
            { name: 'Aceite de oliva', quantity: '10ml', calories: 90, protein: 0, carbs: 0, fat: 10 },
          ] },
      ];
    }

    // MAINTENANCE
    return [
      { name: 'Desayuno', time: '08:00', calories: Math.round(cal * dist[0]),
        protein: Math.round(prot * dist[0]), carbs: Math.round(carbs * dist[0]), fat: Math.round(fat * dist[0]),
        foods: [
          { name: 'Huevos revueltos', quantity: '3 huevos', calories: 210, protein: 18, carbs: 2, fat: 15 },
          { name: 'Pan integral tostado', quantity: '2 rebanadas', calories: 140, protein: 6, carbs: 26, fat: 2 },
          { name: 'Naranja', quantity: '1 mediana', calories: 62, protein: 1, carbs: 15, fat: 0 },
        ] },
      { name: 'Media mañana', time: '11:00', calories: Math.round(cal * dist[1]),
        protein: Math.round(prot * dist[1]), carbs: Math.round(carbs * dist[1]), fat: Math.round(fat * dist[1]),
        foods: [
          { name: 'Yogur natural', quantity: '200g', calories: 100, protein: 8, carbs: 12, fat: 2 },
          { name: 'Kiwi', quantity: '2 unidades', calories: 84, protein: 2, carbs: 20, fat: 0 },
        ] },
      { name: 'Comida', time: '14:00', calories: Math.round(cal * dist[2]),
        protein: Math.round(prot * dist[2]), carbs: Math.round(carbs * dist[2]), fat: Math.round(fat * dist[2]),
        foods: [
          { name: 'Pechuga de pollo', quantity: '180g', calories: 297, protein: 56, carbs: 0, fat: 6 },
          { name: 'Pasta integral', quantity: '80g seca', calories: 290, protein: 12, carbs: 58, fat: 2 },
          { name: 'Tomate y lechuga', quantity: '150g', calories: 30, protein: 1, carbs: 7, fat: 0 },
        ] },
      { name: 'Merienda', time: '17:30', calories: Math.round(cal * dist[3]),
        protein: Math.round(prot * dist[3]), carbs: Math.round(carbs * dist[3]), fat: Math.round(fat * dist[3]),
        foods: [
          { name: 'Requesón', quantity: '150g', calories: 120, protein: 15, carbs: 5, fat: 4 },
          { name: 'Fresas', quantity: '150g', calories: 48, protein: 1, carbs: 11, fat: 0 },
        ] },
      { name: 'Cena', time: '20:30', calories: Math.round(cal * dist[4]),
        protein: Math.round(prot * dist[4]), carbs: Math.round(carbs * dist[4]), fat: Math.round(fat * dist[4]),
        foods: [
          { name: 'Ternera magra', quantity: '150g', calories: 225, protein: 34, carbs: 0, fat: 9 },
          { name: 'Quinoa', quantity: '100g cocida', calories: 120, protein: 4, carbs: 21, fat: 2 },
          { name: 'Ensalada verde', quantity: '200g', calories: 30, protein: 2, carbs: 6, fat: 0 },
        ] },
    ];
  }

  private getTips(goal: string): string[] {
    const common = [
      'Bebe al menos 2.5–3L de agua al día',
      'Come proteínas en cada comida principal',
      'Duerme 7–9 horas para optimizar la recuperación muscular',
      'Prepara la comida del día siguiente la noche antes',
    ];
    const byGoal: Record<string, string[]> = {
      VOLUME: [
        'Come aunque no tengas hambre — el superávit calórico es clave para ganar masa',
        'Prioriza carbohidratos complejos antes y después del entreno',
        'Un batido de proteínas con leche post-entreno acelera la recuperación',
      ],
      DEFINITION: [
        'Mantén el déficit calórico sin bajar de 200–500 kcal del TDEE',
        'Los cardio en ayunas pueden acelerar la quema de grasa',
        'Aumenta la ingesta de fibra (verduras) para saciarte con menos calorías',
      ],
      MAINTENANCE: [
        'Varía los alimentos para obtener todos los micronutrientes',
        'Escucha las señales de hambre y saciedad de tu cuerpo',
        'Un día a la semana puedes comer algo que te apetezca sin culpa',
      ],
    };
    return [...(byGoal[goal] ?? byGoal.MAINTENANCE), ...common];
  }

  getFoods() {
    return [
      { name: 'Pechuga de pollo', per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 } },
      { name: 'Pechuga de pavo', per100g: { calories: 135, protein: 29, carbs: 0, fat: 1 } },
      { name: 'Salmón', per100g: { calories: 208, protein: 20, carbs: 0, fat: 13 } },
      { name: 'Atún al natural', per100g: { calories: 116, protein: 26, carbs: 0, fat: 1 } },
      { name: 'Merluza', per100g: { calories: 82, protein: 18, carbs: 0, fat: 1 } },
      { name: 'Huevo entero', per100g: { calories: 155, protein: 13, carbs: 1, fat: 11 } },
      { name: 'Clara de huevo', per100g: { calories: 52, protein: 11, carbs: 1, fat: 0 } },
      { name: 'Arroz blanco cocido', per100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 } },
      { name: 'Arroz integral cocido', per100g: { calories: 111, protein: 2.6, carbs: 23, fat: 0.9 } },
      { name: 'Pasta cocida', per100g: { calories: 158, protein: 6, carbs: 31, fat: 1 } },
      { name: 'Avena', per100g: { calories: 389, protein: 17, carbs: 66, fat: 7 } },
      { name: 'Pan integral', per100g: { calories: 247, protein: 13, carbs: 41, fat: 4 } },
      { name: 'Patata cocida', per100g: { calories: 87, protein: 2, carbs: 20, fat: 0 } },
      { name: 'Patata dulce', per100g: { calories: 86, protein: 1.6, carbs: 20, fat: 0 } },
      { name: 'Quinoa cocida', per100g: { calories: 120, protein: 4, carbs: 21, fat: 2 } },
      { name: 'Yogur griego 0%', per100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 } },
      { name: 'Yogur griego entero', per100g: { calories: 97, protein: 9, carbs: 3.6, fat: 5 } },
      { name: 'Leche entera', per100g: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 } },
      { name: 'Queso cottage', per100g: { calories: 98, protein: 11, carbs: 3.4, fat: 4.3 } },
      { name: 'Requesón', per100g: { calories: 74, protein: 11, carbs: 4, fat: 1 } },
      { name: 'Almendras', per100g: { calories: 579, protein: 21, carbs: 22, fat: 50 } },
      { name: 'Nueces', per100g: { calories: 654, protein: 15, carbs: 14, fat: 65 } },
      { name: 'Mantequilla de cacahuete', per100g: { calories: 588, protein: 25, carbs: 20, fat: 50 } },
      { name: 'Aguacate', per100g: { calories: 160, protein: 2, carbs: 9, fat: 15 } },
      { name: 'Aceite de oliva', per100g: { calories: 884, protein: 0, carbs: 0, fat: 100 } },
      { name: 'Brócoli', per100g: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 } },
      { name: 'Espinacas', per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 } },
      { name: 'Plátano', per100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 } },
      { name: 'Manzana', per100g: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 } },
      { name: 'Arándanos', per100g: { calories: 57, protein: 0.7, carbs: 14, fat: 0.3 } },
    ];
  }

  async getLogs(userId: string) {
    return this.prisma.nutritionLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30,
    });
  }

  async createLog(userId: string, dto: { calories: number; protein?: number; carbs?: number; fat?: number; water?: number; notes?: string }) {
    return this.prisma.nutritionLog.create({
      data: { userId, ...dto },
    });
  }
}
