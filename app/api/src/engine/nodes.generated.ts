// AUTO-GENERATED: stubs for Excel-derived nodes
import { ROUND, LOG10, LOG, POW, POWER, IF, MAX, MIN, ABS, INT, AVERAGE, SLOPE, INTERCEPT, RSQ } from './excelFns';

export interface Ctx { [key: string]: any }
export const NOT_IMPL = (id: string, formula: string) => { throw new Error(`Implement node ${id}: ${formula}`); };

/** Sheet1!C6 :: =H3 */
export function Sheet1_C6(ctx: Ctx): any {
  return ctx['Sheet1!H3'];
}

/** Sheet1!C8 :: =H3 */
export function Sheet1_C8(ctx: Ctx): any {
  return ctx['Sheet1!H3'];
}

/** Sheet1!C7 :: =H3 */
export function Sheet1_C7(ctx: Ctx): any {
  return ctx['Sheet1!H3'];
}

/** Sheet1!A6 :: =I3 */
export function Sheet1_A6(ctx: Ctx): any {
  return ctx['Sheet1!I3'];
}

/** Sheet1!A7 :: =I3 */
export function Sheet1_A7(ctx: Ctx): any {
  return ctx['Sheet1!I3'];
}

/** Sheet1!A8 :: =I3 */
export function Sheet1_A8(ctx: Ctx): any {
  return ctx['Sheet1!I3'];
}

/** Sheet1!B9 :: =2*B6 */
export function Sheet1_B9(ctx: Ctx): any {
  return 2 * ctx['Sheet1!B6'];
}

/** Sheet1!B5 :: =0.5*B6 */
export function Sheet1_B5(ctx: Ctx): any {
  return 0.5 * ctx['Sheet1!B6'];
}

/** Sheet1!D9 :: =2*D6 */
export function Sheet1_D9(ctx: Ctx): any {
  return 2 * ctx['Sheet1!D6'];
}

/** Sheet1!D5 :: =0.5*D6 */
export function Sheet1_D5(ctx: Ctx): any {
  return 0.5 * ctx['Sheet1!D6'];
}

/** Sheet1!B12 :: =B18 */
export function Sheet1_B12(ctx: Ctx): any {
  return ctx['Sheet1!B18'];
}

/** Sheet1!B24 :: =B18 */
export function Sheet1_B24(ctx: Ctx): any {
  return ctx['Sheet1!B18'];
}

/** Sheet1!B30 :: =B18 */
export function Sheet1_B30(ctx: Ctx): any {
  return ctx['Sheet1!B18'];
}

/** Sheet1!C24 :: =C18 */
export function Sheet1_C24(ctx: Ctx): any {
  return ctx['Sheet1!C18'];
}

/** Sheet1!C12 :: =C18 */
export function Sheet1_C12(ctx: Ctx): any {
  return ctx['Sheet1!C18'];
}

/** Sheet1!C30 :: =C18 */
export function Sheet1_C30(ctx: Ctx): any {
  return ctx['Sheet1!C18'];
}

/** Sheet1!I23 :: =D18 */
export function Sheet1_I23(ctx: Ctx): any {
  return ctx['Sheet1!D18'];
}

/** Sheet1!D30 :: =D18 */
export function Sheet1_D30(ctx: Ctx): any {
  return ctx['Sheet1!D18'];
}

/** Sheet1!D24 :: =D18 */
export function Sheet1_D24(ctx: Ctx): any {
  return ctx['Sheet1!D18'];
}

/** Sheet1!B38 :: =(D18*0.1)/20000 */
export function Sheet1_B38(ctx: Ctx): any {
  return (ctx['Sheet1!D18'] * 0.1) / 20000;
}

/** Sheet1!D25 :: =D19 */
export function Sheet1_D25(ctx: Ctx): any {
  return ctx['Sheet1!D19'];
}

/** Sheet1!B39 :: =(D19*0.1)/20000 */
export function Sheet1_B39(ctx: Ctx): any {
  return (ctx['Sheet1!D19'] * 0.1) / 20000;
}

/** Sheet1!D31 :: =D19 */
export function Sheet1_D31(ctx: Ctx): any {
  return ctx['Sheet1!D19'];
}

/** Sheet1!N2 :: =(D19-D18)/10 */
export function Sheet1_N2(ctx: Ctx): any {
  return (ctx['Sheet1!D19'] - ctx['Sheet1!D18']) / 10;
}

/** Sheet1!I24 :: =D19 */
export function Sheet1_I24(ctx: Ctx): any {
  return ctx['Sheet1!D19'];
}

/** Sheet1!I25 :: =D20 */
export function Sheet1_I25(ctx: Ctx): any {
  return ctx['Sheet1!D20'];
}

/** Sheet1!B40 :: =(D20*0.1)/20000 */
export function Sheet1_B40(ctx: Ctx): any {
  return (ctx['Sheet1!D20'] * 0.1) / 20000;
}

/** Sheet1!D26 :: =D20 */
export function Sheet1_D26(ctx: Ctx): any {
  return ctx['Sheet1!D20'];
}

/** Sheet1!N3 :: =(D20-D19)/10 */
export function Sheet1_N3(ctx: Ctx): any {
  return (ctx['Sheet1!D20'] - ctx['Sheet1!D19']) / 10;
}

/** Sheet1!D32 :: =D20 */
export function Sheet1_D32(ctx: Ctx): any {
  return ctx['Sheet1!D20'];
}

/** Sheet1!D27 :: =D21 */
export function Sheet1_D27(ctx: Ctx): any {
  return ctx['Sheet1!D21'];
}

/** Sheet1!D33 :: =D21 */
export function Sheet1_D33(ctx: Ctx): any {
  return ctx['Sheet1!D21'];
}

/** Sheet1!I26 :: =D21 */
export function Sheet1_I26(ctx: Ctx): any {
  return ctx['Sheet1!D21'];
}

/** Sheet1!N4 :: =(D21-D20)/4.1 */
export function Sheet1_N4(ctx: Ctx): any {
  return (ctx['Sheet1!D21'] - ctx['Sheet1!D20']) / 4.1;
}

/** Sheet1!B41 :: =(D21*0.1)/20000 */
export function Sheet1_B41(ctx: Ctx): any {
  return (ctx['Sheet1!D21'] * 0.1) / 20000;
}

/** Sheet1!N33 :: =$K$15/O33 */
export function Sheet1_N33(ctx: Ctx): any {
  return ctx['Sheet1!$K$15'] / ctx['Sheet1!O33'];
}

/** Sheet1!N30 :: =$K$15/O30 */
export function Sheet1_N30(ctx: Ctx): any {
  return ctx['Sheet1!$K$15'] / ctx['Sheet1!O30'];
}

/** Sheet1!N28 :: =$K$15/O28 */
export function Sheet1_N28(ctx: Ctx): any {
  return ctx['Sheet1!$K$15'] / ctx['Sheet1!O28'];
}

/** Sheet1!N32 :: =$K$15/O32 */
export function Sheet1_N32(ctx: Ctx): any {
  return ctx['Sheet1!$K$15'] / ctx['Sheet1!O32'];
}

/** Sheet1!N31 :: =$K$15/O31 */
export function Sheet1_N31(ctx: Ctx): any {
  return ctx['Sheet1!$K$15'] / ctx['Sheet1!O31'];
}

/** Sheet1!N29 :: =$K$15/O29 */
export function Sheet1_N29(ctx: Ctx): any {
  return ctx['Sheet1!$K$15'] / ctx['Sheet1!O29'];
}

/** Sheet1!P17 :: =(($N$14-$D$18)/$O$14)*(1/K4) */
export function Sheet1_P17(ctx: Ctx): any {
  return ((ctx['Sheet1!$N$14'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!$O$14']) * (1 / ctx['Sheet1!K4']);
}

/** Sheet1!O17 :: =(($N$14-$D$18)/$O$14)*(1/L4) */
export function Sheet1_O17(ctx: Ctx): any {
  return ((ctx['Sheet1!$N$14'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!$O$14']) * (1 / ctx['Sheet1!L4']);
}

/** Sheet1!C5 :: =0.5*C6 */
export function Sheet1_C5(ctx: Ctx): any {
  return 0.5 * ctx['Sheet1!C6'];
}

/** Sheet1!C9 :: =2*C6 */
export function Sheet1_C9(ctx: Ctx): any {
  return 2 * ctx['Sheet1!C6'];
}

/** Sheet1!A9 :: =2*A6 */
export function Sheet1_A9(ctx: Ctx): any {
  return 2 * ctx['Sheet1!A6'];
}

/** Sheet1!A5 :: =0.5*A6 */
export function Sheet1_A5(ctx: Ctx): any {
  return 0.5 * ctx['Sheet1!A6'];
}

/** Sheet1!B4 :: =0.5*B5 */
export function Sheet1_B4(ctx: Ctx): any {
  return 0.5 * ctx['Sheet1!B5'];
}

/** Sheet1!D4 :: =0.5*D5 */
export function Sheet1_D4(ctx: Ctx): any {
  return 0.5 * ctx['Sheet1!D5'];
}

/** Sheet1!P22 :: =((I23-$D$18)/J23)*(1/$K$4) */
export function Sheet1_P22(ctx: Ctx): any {
  return ((ctx['Sheet1!I23'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!J23']) * (1 / ctx['Sheet1!$K$4']);
}

/** Sheet1!O22 :: =((I23-$D$18)/J23)*(1/$L$4) */
export function Sheet1_O22(ctx: Ctx): any {
  return ((ctx['Sheet1!I23'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!J23']) * (1 / ctx['Sheet1!$L$4']);
}

/** Sheet1!N22 :: =((I23-$D$18)/J23)*(1/$I$4) */
export function Sheet1_N22(ctx: Ctx): any {
  return ((ctx['Sheet1!I23'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!J23']) * (1 / ctx['Sheet1!$I$4']);
}

/** Sheet1!D12 :: =B38/0.1 */
export function Sheet1_D12(ctx: Ctx): any {
  return ctx['Sheet1!B38'] / 0.1;
}

/** Sheet1!D13 :: =B39/0.1 */
export function Sheet1_D13(ctx: Ctx): any {
  return ctx['Sheet1!B39'] / 0.1;
}

/** Sheet1!E31 :: =(((D31-N2)/K4)*(C35/C30))/7850 */
export function Sheet1_E31(ctx: Ctx): any {
  return (((ctx['Sheet1!D31'] - ctx['Sheet1!N2']) / ctx['Sheet1!K4']) * (ctx['Sheet1!C35'] / ctx['Sheet1!C30'])) / 7850;
}

/** Sheet1!E25 :: =(((D25-N2)/L4)*(C35/C24))/7850 */
export function Sheet1_E25(ctx: Ctx): any {
  return (((ctx['Sheet1!D25'] - ctx['Sheet1!N2']) / ctx['Sheet1!L4']) * (ctx['Sheet1!C35'] / ctx['Sheet1!C24'])) / 7850;
}

/** Sheet1!N23 :: =((I24-$D$18)/J24)*(1/$I$4) */
export function Sheet1_N23(ctx: Ctx): any {
  return ((ctx['Sheet1!I24'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!J24']) * (1 / ctx['Sheet1!$I$4']);
}

/** Sheet1!O23 :: =((I24-$D$18)/J24)*(1/$L$4) */
export function Sheet1_O23(ctx: Ctx): any {
  return ((ctx['Sheet1!I24'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!J24']) * (1 / ctx['Sheet1!$L$4']);
}

/** Sheet1!P23 :: =((I24-$D$18)/J24)*(1/$K$4) */
export function Sheet1_P23(ctx: Ctx): any {
  return ((ctx['Sheet1!I24'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!J24']) * (1 / ctx['Sheet1!$K$4']);
}

/** Sheet1!O24 :: =((I25-$D$18)/J25)*(1/$L$4) */
export function Sheet1_O24(ctx: Ctx): any {
  return ((ctx['Sheet1!I25'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!J25']) * (1 / ctx['Sheet1!$L$4']);
}

/** Sheet1!N24 :: =((I25-$D$18)/J25)*(1/$I$4) */
export function Sheet1_N24(ctx: Ctx): any {
  return ((ctx['Sheet1!I25'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!J25']) * (1 / ctx['Sheet1!$I$4']);
}

/** Sheet1!P24 :: =((I25-$D$18)/J25)*(1/$K$4) */
export function Sheet1_P24(ctx: Ctx): any {
  return ((ctx['Sheet1!I25'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!J25']) * (1 / ctx['Sheet1!$K$4']);
}

/** Sheet1!D14 :: =B40/0.1 */
export function Sheet1_D14(ctx: Ctx): any {
  return ctx['Sheet1!B40'] / 0.1;
}

/** Sheet1!E26 :: =(((D26-N3)/L4)*(C35/C24))/7850 */
export function Sheet1_E26(ctx: Ctx): any {
  return (((ctx['Sheet1!D26'] - ctx['Sheet1!N3']) / ctx['Sheet1!L4']) * (ctx['Sheet1!C35'] / ctx['Sheet1!C24'])) / 7850;
}

/** Sheet1!E32 :: =(((D32-N3)/K4)*(C35/C30))/7850 */
export function Sheet1_E32(ctx: Ctx): any {
  return (((ctx['Sheet1!D32'] - ctx['Sheet1!N3']) / ctx['Sheet1!K4']) * (ctx['Sheet1!C35'] / ctx['Sheet1!C30'])) / 7850;
}

/** Sheet1!O25 :: =((I26-$D$18)/J26)*(1/$L$4) */
export function Sheet1_O25(ctx: Ctx): any {
  return ((ctx['Sheet1!I26'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!J26']) * (1 / ctx['Sheet1!$L$4']);
}

/** Sheet1!N25 :: =((I26-$D$18)/J26)*(1/$I$4) */
export function Sheet1_N25(ctx: Ctx): any {
  return ((ctx['Sheet1!I26'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!J26']) * (1 / ctx['Sheet1!$I$4']);
}

/** Sheet1!P25 :: =((I26-$D$18)/J26)*(1/$K$4) */
export function Sheet1_P25(ctx: Ctx): any {
  return ((ctx['Sheet1!I26'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!J26']) * (1 / ctx['Sheet1!$K$4']);
}

/** Sheet1!E33 :: =(((D33-N4)/K4)*(C35/C30))/7850 */
export function Sheet1_E33(ctx: Ctx): any {
  return (((ctx['Sheet1!D33'] - ctx['Sheet1!N4']) / ctx['Sheet1!K4']) * (ctx['Sheet1!C35'] / ctx['Sheet1!C30'])) / 7850;
}

/** Sheet1!E27 :: =(((D27-N4)/L4)*(C35/C24))/7850 */
export function Sheet1_E27(ctx: Ctx): any {
  return (((ctx['Sheet1!D27'] - ctx['Sheet1!N4']) / ctx['Sheet1!L4']) * (ctx['Sheet1!C35'] / ctx['Sheet1!C24'])) / 7850;
}

/** Sheet1!D15 :: =B41/0.1 */
export function Sheet1_D15(ctx: Ctx): any {
  return ctx['Sheet1!B41'] / 0.1;
}

/** Sheet1!C4 :: =0.5*C5 */
export function Sheet1_C4(ctx: Ctx): any {
  return 0.5 * ctx['Sheet1!C5'];
}

/** Sheet1!A4 :: =0.5*A5 */
export function Sheet1_A4(ctx: Ctx): any {
  return 0.5 * ctx['Sheet1!A5'];
}

/** Sheet1!D3 :: =0.5*D4 */
export function Sheet1_D3(ctx: Ctx): any {
  return 0.5 * ctx['Sheet1!D4'];
}

/** Sheet1!K24 :: =AVERAGE(N23,O23,P23) */
export function Sheet1_K24(ctx: Ctx): any {
  return AVERAGE(ctx['Sheet1!N23'], ctx['Sheet1!O23'], ctx['Sheet1!P23']);
}

/** Sheet1!K25 :: =AVERAGE(N24,O24,P24) */
export function Sheet1_K25(ctx: Ctx): any {
  return AVERAGE(ctx['Sheet1!N24'], ctx['Sheet1!O24'], ctx['Sheet1!P24']);
}

/** Sheet1!K26 :: =AVERAGE(N25,O25,P25) */
export function Sheet1_K26(ctx: Ctx): any {
  return AVERAGE(ctx['Sheet1!N25'], ctx['Sheet1!O25'], ctx['Sheet1!P25']);
}

/** Sheet1!F30 :: =AVERAGE(E31:E33) */
export function Sheet1_F30(ctx: Ctx): any {
  return AVERAGE(ctx['Sheet1!E31'], ctx['Sheet1!E32'], ctx['Sheet1!E33']);
}

/** Sheet1!F24 :: =AVERAGE(E25:E27) */
export function Sheet1_F24(ctx: Ctx): any {
  return AVERAGE(ctx['Sheet1!E25'], ctx['Sheet1!E26'], ctx['Sheet1!E27']);
}

/** Sheet1!C3 :: =0.5*C4 */
export function Sheet1_C3(ctx: Ctx): any {
  return 0.5 * ctx['Sheet1!C4'];
}

/** Sheet1!A3 :: =0.5*A4 */
export function Sheet1_A3(ctx: Ctx): any {
  return 0.5 * ctx['Sheet1!A4'];
}

/** Sheet1!L6 :: =RSQ(B3:B9,D3:D9) */
export function Sheet1_L6(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!B3'], ctx['Sheet1!B4'], ctx['Sheet1!B5'], ctx['Sheet1!B6'], ctx['Sheet1!B7'], ctx['Sheet1!B8'], ctx['Sheet1!B9']];
  const xValues = [ctx['Sheet1!D3'], ctx['Sheet1!D4'], ctx['Sheet1!D5'], ctx['Sheet1!D6'], ctx['Sheet1!D7'], ctx['Sheet1!D8'], ctx['Sheet1!D9']];
  return RSQ(yValues, xValues);
}

/** Sheet1!J5 :: =INTERCEPT(C3:C9,D3:D9) */
export function Sheet1_J5(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']];
  const xValues = [ctx['Sheet1!D3'], ctx['Sheet1!D4'], ctx['Sheet1!D5'], ctx['Sheet1!D6'], ctx['Sheet1!D7'], ctx['Sheet1!D8'], ctx['Sheet1!D9']];
  return INTERCEPT(yValues, xValues);
}

/** Sheet1!H4 :: =SLOPE(B3:B9,C3:C9) */
export function Sheet1_H4(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!B3'], ctx['Sheet1!B4'], ctx['Sheet1!B5'], ctx['Sheet1!B6'], ctx['Sheet1!B7'], ctx['Sheet1!B8'], ctx['Sheet1!B9']];
  const xValues = [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']];
  return SLOPE(yValues, xValues);
}

/** Sheet1!H6 :: =RSQ(B3:B9,C3:C9) */
export function Sheet1_H6(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!B3'], ctx['Sheet1!B4'], ctx['Sheet1!B5'], ctx['Sheet1!B6'], ctx['Sheet1!B7'], ctx['Sheet1!B8'], ctx['Sheet1!B9']];
  const xValues = [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']];
  return RSQ(yValues, xValues);
}

/** Sheet1!H5 :: =INTERCEPT(B3:B9,C3:C9) */
export function Sheet1_H5(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!B3'], ctx['Sheet1!B4'], ctx['Sheet1!B5'], ctx['Sheet1!B6'], ctx['Sheet1!B7'], ctx['Sheet1!B8'], ctx['Sheet1!B9']];
  const xValues = [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']];
  return INTERCEPT(yValues, xValues);
}

/** Sheet1!J6 :: =RSQ(C3:C9,D3:D9) */
export function Sheet1_J6(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']];
  const xValues = [ctx['Sheet1!D3'], ctx['Sheet1!D4'], ctx['Sheet1!D5'], ctx['Sheet1!D6'], ctx['Sheet1!D7'], ctx['Sheet1!D8'], ctx['Sheet1!D9']];
  return RSQ(yValues, xValues);
}

/** Sheet1!J4 :: =SLOPE(C3:C9,D3:D9) */
export function Sheet1_J4(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']];
  const xValues = [ctx['Sheet1!D3'], ctx['Sheet1!D4'], ctx['Sheet1!D5'], ctx['Sheet1!D6'], ctx['Sheet1!D7'], ctx['Sheet1!D8'], ctx['Sheet1!D9']];
  return SLOPE(yValues, xValues);
}

/** Sheet1!K6 :: =RSQ(A3:A9,C3:C9) */
export function Sheet1_K6(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!A3'], ctx['Sheet1!A4'], ctx['Sheet1!A5'], ctx['Sheet1!A6'], ctx['Sheet1!A7'], ctx['Sheet1!A8'], ctx['Sheet1!A9']];
  const xValues = [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']];
  return RSQ(yValues, xValues);
}

/** Sheet1!I6 :: =RSQ(A3:A9,C3:C9) */
export function Sheet1_I6(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!A3'], ctx['Sheet1!A4'], ctx['Sheet1!A5'], ctx['Sheet1!A6'], ctx['Sheet1!A7'], ctx['Sheet1!A8'], ctx['Sheet1!A9']];
  const xValues = [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']];
  return RSQ(yValues, xValues);
}

/** Sheet1!I4 :: =SLOPE(A3:A9,C3:C9) */
export function Sheet1_I4(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!A3'], ctx['Sheet1!A4'], ctx['Sheet1!A5'], ctx['Sheet1!A6'], ctx['Sheet1!A7'], ctx['Sheet1!A8'], ctx['Sheet1!A9']];
  const xValues = [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']];
  return SLOPE(yValues, xValues);
}

/** Sheet1!K5 :: =INTERCEPT(A3:A9,C3:C9) */
export function Sheet1_K5(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!A3'], ctx['Sheet1!A4'], ctx['Sheet1!A5'], ctx['Sheet1!A6'], ctx['Sheet1!A7'], ctx['Sheet1!A8'], ctx['Sheet1!A9']];
  const xValues = [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']];
  return INTERCEPT(yValues, xValues);
}

/** Sheet1!I5 :: =INTERCEPT(A3:A9,C3:C9) */
export function Sheet1_I5(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!A3'], ctx['Sheet1!A4'], ctx['Sheet1!A5'], ctx['Sheet1!A6'], ctx['Sheet1!A7'], ctx['Sheet1!A8'], ctx['Sheet1!A9']];
  const xValues = [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']];
  return INTERCEPT(yValues, xValues);
}

/** Sheet1!L5 :: =INTERCEPT(A3:A9,C3:C9) */
export function Sheet1_L5(ctx: Ctx): any {
  const yValues = [ctx['Sheet1!A3'], ctx['Sheet1!A4'], ctx['Sheet1!A5'], ctx['Sheet1!A6'], ctx['Sheet1!A7'], ctx['Sheet1!A8'], ctx['Sheet1!A9']];
  const xValues = [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']];
  return INTERCEPT(yValues, xValues);
}

/** Sheet1!E13 :: =(((D13-H5)/H4)*(C12*B12))/14.65 */
export function Sheet1_E13(ctx: Ctx): any {
  return (((ctx['Sheet1!D13'] - ctx['Sheet1!H5']) / ctx['Sheet1!H4']) * (ctx['Sheet1!C12'] * ctx['Sheet1!B12'])) / 14.65;
}

/** Sheet1!E15 :: =(((D15-H5)/H4)*(C12*B12))/14.65 */
export function Sheet1_E15(ctx: Ctx): any {
  return (((ctx['Sheet1!D15'] - ctx['Sheet1!H5']) / ctx['Sheet1!H4']) * (ctx['Sheet1!C12'] * ctx['Sheet1!B12'])) / 14.65;
}

/** Sheet1!E12 :: =(((D12-H5)/H4)*(C12*B12))/14.65 */
export function Sheet1_E12(ctx: Ctx): any {
  return (((ctx['Sheet1!D12'] - ctx['Sheet1!H5']) / ctx['Sheet1!H4']) * (ctx['Sheet1!C12'] * ctx['Sheet1!B12'])) / 14.65;
}

/** Sheet1!E14 :: =IFERROR(H6*0.1,0) */
export function Sheet1_E14(ctx: Ctx): any {
  const { IFERROR } = require('./excelFns');
  return IFERROR(ctx['Sheet1!H6'] * 0.1, 0);
}

/** Sheet1!E19 :: =(((D19-N2)/I4)*(C35/C18))/7850 */
export function Sheet1_E19(ctx: Ctx): any {
  return (((ctx['Sheet1!D19'] - ctx['Sheet1!N2']) / ctx['Sheet1!I4']) * (ctx['Sheet1!C35'] / ctx['Sheet1!C18'])) / 7850;
}

/** Sheet1!E20 :: =(((D20-N3)/I4)*(C35/C18))/7850 */
export function Sheet1_E20(ctx: Ctx): any {
  return (((ctx['Sheet1!D20'] - ctx['Sheet1!N3']) / ctx['Sheet1!I4']) * (ctx['Sheet1!C35'] / ctx['Sheet1!C18'])) / 7850;
}

/** Sheet1!N17 :: =(($N$14-$D$18)/$O$14)*(1/I4) */
export function Sheet1_N17(ctx: Ctx): any {
  return ((ctx['Sheet1!$N$14'] - ctx['Sheet1!$D$18']) / ctx['Sheet1!$O$14']) * (1 / ctx['Sheet1!I4']);
}

/** Sheet1!E30 :: =(((D30-K5)/K4)*(C35/C30))/7850 */
export function Sheet1_E30(ctx: Ctx): any {
  return (((ctx['Sheet1!D30'] - ctx['Sheet1!K5']) / ctx['Sheet1!K4']) * (ctx['Sheet1!C35'] / ctx['Sheet1!C30'])) / 7850;
}

/** Sheet1!E18 :: =(((D18-I5)/I4)*(C35/C18))/7850 */
export function Sheet1_E18(ctx: Ctx): any {
  return (((ctx['Sheet1!D18'] - ctx['Sheet1!I5']) / ctx['Sheet1!I4']) * (ctx['Sheet1!C35'] / ctx['Sheet1!C18'])) / 7850;
}

/** Sheet1!E24 :: =(((D24-L5)/L4)*(C35/C24))/7850 */
export function Sheet1_E24(ctx: Ctx): any {
  return (((ctx['Sheet1!D24'] - ctx['Sheet1!L5']) / ctx['Sheet1!L4']) * (ctx['Sheet1!C35'] / ctx['Sheet1!C24'])) / 7850;
}

/** Sheet1!L24 :: =(LOG(E13)-LOG(K24)) */
export function Sheet1_L24(ctx: Ctx): any {
  const { LOG } = require('./excelFns');
  return LOG(ctx['Sheet1!E13']) - LOG(ctx['Sheet1!K24']);
}

/** Sheet1!L26 :: =(LOG(E15)-LOG(K26)) */
export function Sheet1_L26(ctx: Ctx): any {
  const { LOG } = require('./excelFns');
  return LOG(ctx['Sheet1!E15']) - LOG(ctx['Sheet1!K26']);
}

/** Sheet1!F12 :: =E12-E12 */
export function Sheet1_F12(ctx: Ctx): any {
  return ctx['Sheet1!E12'] - ctx['Sheet1!E12'];
}

/** Sheet1!F13 :: =E13-E12 */
export function Sheet1_F13(ctx: Ctx): any {
  return ctx['Sheet1!E13'] - ctx['Sheet1!E12'];
}

/** Sheet1!L23 :: =(LOG(E12)-LOG(K23)) */
export function Sheet1_L23(ctx: Ctx): any {
  const { LOG } = require('./excelFns');
  return LOG(ctx['Sheet1!E12']) - LOG(ctx['Sheet1!K23']);
}

/** Sheet1!K23 :: =E12 */
export function Sheet1_K23(ctx: Ctx): any {
  return ctx['Sheet1!E12'];
}

/** Sheet1!F14 :: =E14-E13 */
export function Sheet1_F14(ctx: Ctx): any {
  return ctx['Sheet1!E14'] - ctx['Sheet1!E13'];
}

/** Sheet1!L25 :: =(LOG(E14)-LOG(K25)) */
export function Sheet1_L25(ctx: Ctx): any {
  const { LOG } = require('./excelFns');
  return LOG(ctx['Sheet1!E14']) - LOG(ctx['Sheet1!K25']);
}

/** Sheet1!F15 :: =E15-E14 */
export function Sheet1_F15(ctx: Ctx): any {
  return ctx['Sheet1!E15'] - ctx['Sheet1!E14'];
}

/** Sheet1!F18 :: =AVERAGE(E19:E21) */
export function Sheet1_F18(ctx: Ctx): any {
  return (ctx['Sheet1!E19'] + ctx['Sheet1!E20'] + ctx['Sheet1!E21']) / 3;
}

/** Sheet1!P14 :: =AVERAGE(N17,O17,P17) */
export function Sheet1_P14(ctx: Ctx): any {
  return (ctx['Sheet1!N17'] + ctx['Sheet1!O17'] + ctx['Sheet1!P17']) / 3;
}

/** Sheet1!K28 :: =AVERAGE(L23:L26) */
export function Sheet1_K28(ctx: Ctx): any {
  return (ctx['Sheet1!L23'] + ctx['Sheet1!L24'] + ctx['Sheet1!L25'] + ctx['Sheet1!L26']) / 4;
}

/** Sheet1!I15 :: =AVERAGE(F18,F24,F30) */
export function Sheet1_I15(ctx: Ctx): any {
  return (ctx['Sheet1!F18'] + ctx['Sheet1!F24'] + ctx['Sheet1!F30']) / 3;
}

/** Sheet1!J15 :: =(I15*C18) */
export function Sheet1_J15(ctx: Ctx): any {
  return ctx['Sheet1!I15'] * ctx['Sheet1!C18'];
}

/** Sheet1!M10 :: =(LOG(L10)) */
export function Sheet1_M10(ctx: Ctx): any {
  const { LOG } = require('./excelFns');
  return LOG(ctx['Sheet1!L10']);
}

/** Sheet1!J30 :: =(J15/POWER(10,K28)) */
export function Sheet1_J30(ctx: Ctx): any {
  const { POWER } = require('./excelFns');
  return ctx['Sheet1!J15'] / POWER(10, ctx['Sheet1!K28']);
}

/** Sheet1!N10 :: =IFERROR(AVERAGE(N23:N26),0) */
export function Sheet1_N10(ctx: Ctx): any {
  const { IFERROR, AVERAGE } = require('./excelFns');
  return IFERROR(AVERAGE(ctx['Sheet1!N23'], ctx['Sheet1!N24'], ctx['Sheet1!N25'], ctx['Sheet1!N26']), 0);
}

/** Sheet1!O10 :: =LOG(N10) */
export function Sheet1_O10(ctx: Ctx): any {
  const { LOG } = require('./excelFns');
  return LOG(ctx['Sheet1!N10']);
}

/** Sheet1!P10 :: =ROUND(ABS(M10-O10),0) */
export function Sheet1_P10(ctx: Ctx): any {
  const { ROUND, ABS } = require('./excelFns');
  return ROUND(ABS(ctx['Sheet1!M10'] - ctx['Sheet1!O10']), 0);
}

/** Sheet1!K15 :: =(J15/POWER(10,P10))*J11 */
export function Sheet1_K15(ctx: Ctx): any {
  const { POWER } = require('./excelFns');
  return (ctx['Sheet1!J15'] / POWER(10, ctx['Sheet1!P10'])) * ctx['Sheet1!J11'];
}

/** Sheet1!L15 :: =IF(I15>=ROUND(LOG(J30),0),K15/10,K15) */
export function Sheet1_L15(ctx: Ctx): any {
  const { IF, ROUND, LOG } = require('./excelFns');
  return IF(Number(ctx['Sheet1!I15']) >= ROUND(LOG(Number(ctx['Sheet1!J30'])), 0), Number(ctx['Sheet1!K15']) / 10, Number(ctx['Sheet1!K15']));
}

/** Sheet1!L10 :: =I15 */
export function Sheet1_L10(ctx: Ctx): any {
  return Number(ctx['Sheet1!I15']);
}

/** Sheet1!K4 :: =SLOPE(A3:A9,C3:C9) */
export function Sheet1_K4(ctx: Ctx): any {
  const { SLOPE } = require('./excelFns');
  return SLOPE([ctx['Sheet1!A3'], ctx['Sheet1!A4'], ctx['Sheet1!A5'], ctx['Sheet1!A6'], ctx['Sheet1!A7'], ctx['Sheet1!A8'], ctx['Sheet1!A9']], 
                [ctx['Sheet1!C3'], ctx['Sheet1!C4'], ctx['Sheet1!C5'], ctx['Sheet1!C6'], ctx['Sheet1!C7'], ctx['Sheet1!C8'], ctx['Sheet1!C9']]);
}

/** Sheet1!L4 :: =SLOPE(B3:B9,D3:D9) */
export function Sheet1_L4(ctx: Ctx): any {
  const { SLOPE } = require('./excelFns');
  return SLOPE([ctx['Sheet1!B3'], ctx['Sheet1!B4'], ctx['Sheet1!B5'], ctx['Sheet1!B6'], ctx['Sheet1!B7'], ctx['Sheet1!B8'], ctx['Sheet1!B9']], 
                [ctx['Sheet1!D3'], ctx['Sheet1!D4'], ctx['Sheet1!D5'], ctx['Sheet1!D6'], ctx['Sheet1!D7'], ctx['Sheet1!D8'], ctx['Sheet1!D9']]);
}

/** Sheet1!E21 :: =(((D21-N4)/I4)*(C35/C18))/7850 */
export function Sheet1_E21(ctx: Ctx): any {
  return (((ctx['Sheet1!D21'] - ctx['Sheet1!N4']) / ctx['Sheet1!I4']) * (ctx['Sheet1!C35'] / ctx['Sheet1!C18'])) / 7850;
}

