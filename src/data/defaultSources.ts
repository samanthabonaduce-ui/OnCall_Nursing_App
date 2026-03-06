import { SourceFile } from "../types";

export const DEFAULT_SOURCES: SourceFile[] = [
  {
    id: "ch53-diabetes",
    name: "Chapter 53: Diabetes Mellitus",
    isEmbedded: true,
    moduleId: "Module 2 - Diabetes",
    courseId: "Nursing 2",
    content: `Chapter 53: Diabetes (DM)
A chronic multisystem disease characterized by hyperglycemia related to abnormal insulin production, impaired insulin use, or both.
Affects estimated 34.2 million people in United States. 88 million have prediabetes. 17.3 million unaware. 7th leading cause of death.

Etiology and Pathophysiology:
Theory of causes single or combination of factor(s): Genetic, Autoimmune, Environmental.
Primarily a disorder of glucose metabolism related to absent/insufficient insulin and/or ineffective use of available insulin.

Classes of Diabetes:
1. Type I: Autoimmune disorder. Body develops antibodies against insulin and/or pancreatic beta cells. Absence of endogenous insulin. Generally affects people under age 40. Rapid onset with ketoacidosis. Requires exogenous insulin.
2. Type 2: Most prevalent (90-95%). Pancreas makes some endogenous insulin but not enough or body doesn't use it effectively (insulin resistance). Risk factors: obesity, advanced age, family history. Gradual onset.
3. Gestational: Develops during pregnancy.
4. Other: Results from injury to, interference with, or destruction of beta-cell function (e.g., medical conditions or drugs).

Normal Insulin Metabolism:
Insulin is a hormone produced by beta-cells in islets of Langerhans. Released continuously into bloodstream in small increments (basal) with larger amounts after food (bolus). Stabilizes glucose level in range of 74 to 106 mg/dL.
Insulin promotes glucose transport from bloodstream across cell membrane to cytoplasm. Cells break down glucose for energy. Liver and muscle cells store excess glucose as glycogen.

Counterregulatory Hormones:
Glucagon, epinephrine, growth hormone, cortisol. Oppose effects of insulin. Stimulate glucose production and release by liver. Help maintain normal glucose levels.

Diagnostic Studies:
- A1C level: 6.5% or higher (reflects glucose over past 2-3 months).
- Fasting plasma glucose (FPG): > 126 mg/dL.
- 2-hour plasma glucose during OGTT: > 200 mg/dL.
- Classic symptoms of hyperglycemia + random glucose > 200 mg/dL.

Clinical Manifestations:
Type 1: Polyuria, Polydipsia, Polyphagia, Weight loss, Weakness, Fatigue.
Type 2: Nonspecific symptoms (fatigue, recurrent infections, prolonged wound healing, visual changes).`
  },
  {
    id: "infographic-dm-overview",
    name: "Reference: DM Overview",
    isEmbedded: true,
    moduleId: "Module 2 - Diabetes",
    courseId: "Nursing 2",
    content: `DIABETES MELLITUS OVERVIEW
DM Type I: Autoimmune disorder, Genetic link, Idiopathic, Latent autoimmune in adults. Treatment: Insulin Therapy, Lifestyle (Diet, Exercise, Monitoring).
DM Type II: Genetic link, Insulin resistance, decreased insulin production, Inappropriate hepatic glucose production. Treatment: Oral Anti-Diabetic Therapy, Insulin if necessary, Lifestyle.

Signs & Symptoms:
- Classic: Polyuria, Polydipsia, Polyphagia.
- Others: Weight loss, Weakness, Fatigue, Recurrent infections (vaginal yeast/candida), Prolonged wound healing, Visual changes.

The Pancreas:
Home to islets of Langerhans.
- Alpha-cells: secrete glucagon.
- Beta-cells: secrete insulin.

Insulin & Glucose:
Insulin released continuously (Basal/Bolus concept). Stabilizes glucose 74-106 mg/dL. Liver/muscle store excess as glycogen.

Foot Care:
Proper footwear, Skin & Nail care, Daily inspection, Avoid injuries, Prompt treatment.

Self-Glucose Monitoring:
Enables decisions for diet/exercise/meds. Frequency varies: Before meals, Hyper/Hypoglycemia, During illness, Before/After exercise.`
  },
  {
    id: "infographic-acute-complications",
    name: "Reference: DM Acute Complications",
    isEmbedded: true,
    moduleId: "Module 2 - Diabetes",
    courseId: "Nursing 2",
    content: `DM ACUTE COMPLICATIONS
Hypoglycemia: Glucose < 70 mg/dL. 
- Symptoms: Shakiness, Palpitations, Nervousness, Diaphoresis, Difficulty speaking/seeing, Confusion, Seizures/Coma.
- Causes: Too much insulin/meds, Too little food, Delayed eating, Too much exercise.
- Treatment (Rule of 15): 15g simple carb, recheck in 15 mins. Repeat if < 70. Give complex CHO after recovery.
- Acute Care: 50% Dextrose (D50) IVP or Glucagon 1mg IM/SQ.

DKA (Diabetic Ketoacidosis) & HHS (Hyperosmolar Hyperglycemic Syndrome):
#1 Precipitating Factor: Illness/Infection.
- DKA: Caused by profound insulin deficiency. Hyperglycemia (>250), Ketosis (ketones in urine/serum, fruity breath), Acidosis (pH < 7.30, Bicarb < 16, Kussmaul respirations).
- HHS: Enough insulin to prevent ketoacidosis but severe hyperglycemia (>600). More severe neuro manifestations due to high serum osmolality. Ketones absent/minimal.
- Treatment: IV Fluids (0.9% NaCl), IV Insulin (Regular), Electrolyte replacement (especially K+).

IV Insulin Therapy:
Regular insulin ONLY. Glucose monitoring Q1H. Initiate Dextrose IV when glucose reaches 250 mg/dL. Plan for K+ replacement as insulin promotes K+ entering cells.`
  },
  {
    id: "infographic-chronic-complications",
    name: "Reference: DM Chronic Complications",
    isEmbedded: true,
    moduleId: "Module 2 - Diabetes",
    courseId: "Nursing 2",
    content: `DM CHRONIC COMPLICATIONS
Causes: Damage to blood vessels secondary to Chronic Hyperglycemia & HTN. No ability to truly reverse damage.

Macrovascular (Large/Medium vessels):
- Cerebrovascular (Stroke)
- Cardiovascular (Heart Disease)
- Peripheral vascular (PAD)
- Risk Factors: Obesity, Smoking, HTN, High fat intake/dyslipidemia, Sedentary lifestyle.

Microvascular (Capillaries/Arterioles):
- Retinopathy: Leading cause of blindness.
- Nephropathy: Leading cause of ESRD/Dialysis. Use ACEs & ARBs to protect kidneys.
- Neuropathy: Nerve damage.
  - Sensory: Peripheral loss of sensation, numbness/tingling/burning. Risk for foot ulcers/amputation.
  - Autonomic: Gastroparesis (delayed gastric emptying), Neurogenic Bladder (urinary retention), Painless MI, Orthostatic hypotension, Sexual Dysfunction.

Infection: Impaired immune function. Treat quickly. Hand hygiene & Vaccines.

Annual Prevention: Annual Eye Exams, A1C & Annual blood work.`
  },
  {
    id: "infographic-drug-therapy",
    name: "Reference: DM Drug Therapy",
    isEmbedded: true,
    moduleId: "Module 2 - Diabetes",
    courseId: "Nursing 2",
    content: `DM DRUG THERAPY
Insulin Types:
- Rapid-acting (Aspart/Novolog, Lispro/Humalog): Eat within 10-15 mins. Peak/Crash around 3 hours.
- Short-acting (Novolin R, Humulin R): Eat within 25-30 mins. Peak/Crash around 5 hours.
- Intermediate-acting (NPH, Novolin N, Humulin N): Peak/Crash around 12 hours.
- Long-acting (Glargine/Lantus, Detemir/Levemir, Degludec/Tresiba): No peak.

Sliding Scale Insulin:
Covers current BG level, not future intake. Usually rapid or regular insulin. Ranges from hypoglycemic protocol (<70) to calling HCP (>350).

Anti-Diabetic Agents:
- Increase Insulin Production: Sulfonylureas (Glipizide, Glyburide, Glimepiride), Meglitinides (Repaglinide, Nateglinide), DPP-4 Inhibitors (Gliptins), GLP-1 Receptor Agonists (Exenatide, Liraglutide).
- Decrease Insulin Resistance/Hepatic Glucose: Biguanides (Metformin), Thiazolidinediones (Pioglitazone, Rosiglitazone).
- Decrease Glucose Reabsorption: SGLT Inhibitors (Canagliflozin, Dapagliflozin).

High Risk Meds: Insulin requires 2 nurse verification. IV insulin MUST be on a pump!`
  },
  {
    id: "cardiac-raas-ace-arb",
    name: "Reference: RAAS, ACE & ARB",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 1",
    courseId: "Nursing 2",
    content: `RENIN-ANGIOTENSIN-ALDOSTERONE SYSTEM (RAAS)
RAAS kicks in when the body senses low blood pressure. The kidneys are directed to secrete renin & start one of the many feedback mechanisms to low BP. Baroreceptors in the aortic arch & carotid sinuses sense the reduced stretch (low BP) & the kidneys sense reduced renal perfusion.

ANGIOTENSIN-CONVERTING ENZYME (ACE) INHIBITORS - "PRIL"
Medications: Lisinopril (Zestril), Benazepril (Lotensin), Enalapril (Vasotec).
Action: Prevents the conversion of angiotensin I to angiotensin II (A-II) & reduce A-II mediated vasoconstriction & sodium & water retention.
Side Effects: Orthostatic Hypotension, Cough, & Angioedema.

ANGIOTENSIN RECEPTOR BLOCKERS (ARB) - "SARTAN"
Medications: Valsartan (Diovan), Losartan (Cozaar), Olmesartan (Benicar).
Action: Prevents angiotensin II (A-II) from binding to its receptors in the walls of the blood vessels & causing vasoconstriction.
Side Effects: Orthostatic Hypotension.

CAUTION: Cannot be combined with potassium-sparing diuretics or other ACEs or ARBs. Monitor BP & K+ levels.`
  },
  {
    id: "cardiac-antidysrhythmics",
    name: "Reference: Antidysrhythmics",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 1",
    courseId: "Nursing 2",
    content: `ANTIDYSRHYTHMICS: ACTION POTENTIAL & CLASSIFICATION
CLASS I: NA+ CHANNEL BLOCKERS
- 1A: Slow conduction, prolongs repolarization. Meds: Quinidine, Procainamide.
- 1B: Slow conduction, shortens repolarization. Meds: Lidocaine.
- 1C: Prolonged conduction with little/no effect on repolarization. Meds: Flecainide (Tambocor), Propafenone (Rythmol).

CLASS II: BETA BLOCKERS
Reduce calcium entry, decrease conduction velocity, automaticity, & recovery time.
Meds: Propranolol (Inderal), Acebutolol (Sectral), Esmolol (Brevibloc).

CLASS III: K+ CHANNEL BLOCKERS
Prolong repolarization.
Meds: Amiodarone (Cordarone), Dronedarone (Multaq), Dofetilide (Tikosyn), Sotalol (Betapace).

CLASS IV: CALCIUM CHANNEL BLOCKERS
Block calcium influx.
Meds: Verapamil (Calan), Diltiazem (Cardizem).

MONITOR: Watch for Prolonged QT Intervals. Do Not take with meds that also cause prolonged QT.`
  },
  {
    id: "cardiac-arni",
    name: "Reference: Natriuretic Peptides & ARNI",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 1",
    courseId: "Nursing 2",
    content: `NATRIURETIC PEPTIDES & ARNI
NATRIURETIC PEPTIDES (ANP & BNP): Compensatory hormones released by the atria & left ventricle during increased workload of the heart. Effects: Natriuresis, Diuresis, Vasodilation.

NEPRILYSIN ENZYME: Breaks down these peptides, inactivating their compensatory responses.

ACTION OF AN ARNI (Angiotensin II/Neprilysin Inhibitor):
Inhibiting neprilysin increases the bioavailability of natriuretic peptides (ANP & BNP) resulting in natriuresis, diuresis, & vasodilation.
Inhibiting Angiotensin II results in systemic vasodilation, thereby reducing preload & afterload, & blocks aldosterone activation of the sodium potassium pump thereby NOT allowing retention of sodium & water to increase blood volume.

Medication: Sacubitril/Valsartan (Entresto).
CAUTION: Long-term Tx of Heart Failure. Cannot be given with an ACE or ARB.`
  },
  {
    id: "cardiac-autonomic-ns",
    name: "Reference: Autonomic NS Agents",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 1",
    courseId: "Nursing 2",
    content: `AUTONOMIC NS AGENTS: BETA'S & ALPHA'S
SYMPATHETIC NERVOUS SYSTEM (SNS): Responsible for maintaining vascular tone & pacing SA node & inhibiting vagal tone (heart rate). "Fight or Flight" Response.

BETA ADRENERGIC AGENTS:
- Beta-1 Antagonists ("LOL"): Inhibit cardiac response to sympathetic nerve stimulation. Meds: Propranolol, Sotalol, Atenolol, Metoprolol, Carvedilol, Labetalol. Side Effects: bradycardia, hypotension.
- Beta-2 Agonists ("TEROL"): Binds with B-2 receptors on smooth muscle in bronchioles = Bronchodilation. Meds: Albuterol. Side Effects: Tachycardia.

ALPHA ADRENERGIC AGENTS:
- Alpha-1 Antagonists ("OSIN"): Blocks binding of epinephrine to a-1 receptors causing vasodilation. Meds: Doxazosin, Terazosin, Tamsulosin. Side Effects: Orthostatic Hypotension.
- Alpha-2 Agonists: Stimulate a-2 receptors in the brainstem resulting in reduced sympathetic tone = vasodilation. Meds: Clonidine, Methyldopa. Side Effects: drowsiness, dry mouth, dizziness.

CAUTION: Monitor vitals - BP & HR. Do not abruptly stop taking beta blockers.`
  },
  {
    id: "cardiac-bp-101",
    name: "Reference: Blood Pressure 101",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 1",
    courseId: "Nursing 2",
    content: `BLOOD PRESSURE 101: BP = CO x SVR
Cardiac Output (CO) = Heart Rate (HR) x Stroke Volume (SV).
Systemic Vascular Resistance (SVR) = Force opposing the movement of blood within blood vessels.

REGULATION OF BLOOD PRESSURE:
- Sympathetic Nervous System: Baroreceptors & Chemoreceptors. a-1, a-2, b-1, b-2 receptors.
- Vascular Endothelium: Prostaglandins & Nitric Oxide (Vasodilation), Endothelium (Vasoconstriction).
- Renal & Endocrine Systems: RAAS, Natriuretic Peptides, Osmoreceptors (ADH release).

FACTORS AFFECTING CO:
- Preload: Pressure from volume of blood left at end of diastole ("prior to next filling").
- Afterload: Pressure (peripheral resistance) the heart has to pump against ("entering the Aorta").
- Contractility: The force at which the heart contracts.`
  },
  {
    id: "cardiac-diuretics",
    name: "Reference: Diuretic Therapy",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 1",
    courseId: "Nursing 2",
    content: `DIURETIC THERAPY
Goal: Maintain normal BP & fluid balance. Remember: 1L Fluid = 1kg (2.2 lbs).

POTASSIUM WASTING DIURETICS:
- Thiazide & Thiazide-like ("ide"): Hydrochlorothiazide (HCTZ), Metolazone.
- Loop Diuretics ("ide"): Furosemide (Lasix), Bumetanide (Bumex). Given IV for symptomatic fluid overload.
Nursing Considerations: Monitor for F/E imbalances, hypotension. Teach K+ rich foods.

POTASSIUM SPARING DIURETICS:
- Aldosterone Antagonist: Spironolactone (Aldactone).
- ESC Blocker: Triamterene (Dyrenium).
Nursing Considerations: Monitor for hyperkalemia, hypotension. Do not combine with K+ sparing diuretics, ACEs/ARBs.

RENIN INHIBITOR: Aliskiren (Tekturna). Directly inhibits renin, reducing RAAS effects.`
  },
  {
    id: "cardiac-vasodilators",
    name: "Reference: Direct Vasodilators & Nitrates",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 1",
    courseId: "Nursing 2",
    content: `DIRECT VASODILATORS & THE NITRATE FAMILY
DIRECT VASODILATORS:
Medication: Hydralazine (Apresoline). Action: Binds to arterial smooth muscle causing vasodilation. Side Effects: rebound tachycardia, orthostatic hypotension.

NITRATES:
- Nitroglycerin: Relaxes venous & arterial smooth muscle. Low doses = venous > arterial; High doses = arterial > venous.
- Action of Nitroprusside: Direct arterial smooth muscle vasodilation.
Side Effects: headache, hypotension, dizziness. Follow protocols for IV drips (special tubing, light sensitivity).

ANTI-ANGINALS:
Short-term CP Tx = MONA (Morphine, Oxygen, Nitrates, Aspirin).
Long-acting nitrates: Isosorbide mononitrate (Imdur), Isosorbide Dinitrate (Isordil).`
  },
  {
    id: "cardiac-diagnostics",
    name: "Reference: Cardiac Diagnostics",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 1",
    courseId: "Nursing 2",
    content: `CARDIAC DIAGNOSTICS
INDICATIONS: HTN, Dysrhythmias, Chest Pain, ACS, CAD, MI, CVD/PVD, Cardiomyopathy, Heart Failure.

LAB/BLOODWORK:
- Cardiac Enzymes/Biomarkers: Troponin, Myoglobin (MB), Creatine Kinase (CK/CPK/CK-MB).
- BNP: Released in signs of fluid overload & Heart Failure.
- BUN/Creatinine: Decreased CO leads to Pre-Renal AKI.
- Lipids: LDL, VLDL, HDL, Total Cholesterol & Triglycerides.

NON-INVASIVE TESTING & IMAGING:
- ECG: Electrical conduction problem. Holter monitoring.
- Ultrasound (Echocardiogram): Heart structure, valve function, Ejection Fraction (EF). Normal EF: 55-65%.
- Nuclear Imaging: Stress (Exercise) Test.
- Imaging: CXR, CT, MRI, PET.

INVASIVE TESTING: Hemodynamic Monitoring (NIBP, HR, SPO2, ABP, CVP, CV02, LVEDV), TEE (Transesophageal Echocardiogram), Cardiac Catheterization.`
  },
  {
    id: "cardiac-rhythms",
    name: "Reference: Cardiac Rhythms",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 1",
    courseId: "Nursing 2",
    content: `CARDIAC RHYTHMS: SINUS & ATRIAL
SINUS RHYTHMS:
- Normal Sinus Rhythm (NSR): 60-100 bpm.
- Sinus Bradycardia: <60 bpm. Tx: Atropine, Pacemaker.
- Sinus Tachycardia: >100 bpm. Tx: Vagal maneuver, B-blockers/CCBs.

ATRIAL RHYTHMS:
- Premature Atrial Contraction (PAC): Contraction from ectopic focus in atrium.
- Paroxysmal Supraventricular Tachycardia (SVT): 151-220 bpm. Tx: Vagal maneuver, IV Adenosine, Cardioversion.
- Atrial Fibrillation: Most common dysrhythmia. Risk of stroke. Tx: Rate control (CCBs/Beta's), Anticoagulant, Cardioversion.
- Atrial Flutter: Typically associated with disease.

RHYTHM MEASURING:
- PR Interval: 0.12-0.20 sec.
- QRS Interval: <0.12 sec.
- QT Interval: 0.34-0.43 sec.`
  },
  {
    id: "cardiac-ccb",
    name: "Reference: Calcium Channel Blockers",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 1",
    courseId: "Nursing 2",
    content: `CALCIUM CHANNEL BLOCKERS (CCB)
Calcium is needed for muscle contraction. CCBs inhibit movement of Ca+ across cell membranes.

NON-DIHYDROPYRIDINES:
Action: Inhibit Ca+ across cardiac & vascular muscle. Results in decreased contractility & conduction (SA & AV node).
Medications: Diltiazem (Cardizem), Verapamil (Calan).
Side Effects: Hypotension, Bradycardia.

DIHYDROPYRIDINES ("PINES"):
Action: Inhibit Ca+ across vascular smooth muscle. Results in vasodilation & decreased PVR, with no effect on the heart.
Medications: Amlodipine (Norvasc), Nicardipine (Cardene), Nifedipine (Procardia).
Side Effects: Hypotension, peripheral edema.

MONITOR: Vitals - BP & HR, Rhythm.`
  },
  {
    id: "cardiac-clotting",
    name: "Reference: Drugs Affecting Blood Clotting",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 1",
    courseId: "Nursing 2",
    content: `DRUGS AFFECTING BLOOD CLOTTING
ANTICOAGULANT THERAPY:
- Vitamin K Antagonist: Warfarin (Coumadin). Monitor INR (2-3 for A-fib, 2.5-3.5 for Valve).
- Thrombin Inhibitors: Heparin (Monitor aPTT), Enoxaparin (Lovenox - Low molecular weight).
- Factor Xa Inhibitors: Rivaroxaban (Xarelto), Apixaban (Eliquis).

ANTIPLATELET THERAPY:
Action: Inhibits platelet aggregation.
Medications: Aspirin, Clopidogrel (Plavix), Prasugrel (Effient), Ticagrelor (Brilinta).

THROMBOLYTICS ("CLOT BUSTERS"):
Action: Breaks down/Dissolves clots.
Medications: tPA (Alteplase, Retavase).

SIDE EFFECTS: Bleeding. Teach soft bristle toothbrush, electric razors, avoid NSAIDs/Aspirin.`
  },
  {
    id: "cardiac-htn",
    name: "Reference: Hypertension",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 1",
    courseId: "Nursing 2",
    content: `HYPERTENSION (HTN)
PRIMARY HTN (90-95%): BP without identified cause. Risk factors: Obesity, SNS activity, Na+ intake, Tobacco/ETOH.
SECONDARY HTN: BP with a specific cause that can be corrected.

SIGNS/SYMPTOMS CATEGORIES:
- Normal: <120 SBP AND <80 DBP.
- Elevated: 120-129 SBP AND <80 DBP.
- Hypertension, Stage 1: 130-139 SBP OR 80-89 DBP.
- Hypertension, Stage 2: >=140 SBP OR >=90 DBP.

TREATMENT:
- DASH Diet: Fruits, vegetables, fat-free milk, whole grains, fish, poultry, beans, seeds, & nuts. <2gm Na+.
- Exercise & Weight Loss.
- Drug Therapy A-B-C-D: 1. Thiazide Diuretic, 2. CCB, 3. ACE/ARB.`
  },
  {
    id: "cardiac-cad-lipids",
    name: "Reference: CAD & Lipid-Lowering Therapy",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 2",
    courseId: "Nursing 2",
    content: `CORONARY ARTERY DISEASE (CAD) & LIPID-LOWERING DRUGS
PATHOPHYSIOLOGY: Progressive disease developing over years. Endothelium lining damaged via HTN, tobacco, lipids, DM, toxins. Atherosclerosis: fatty deposits. Stages: (1) fatty streak, (2) fibrous plaque, (3) complicated lesion.

RISK FACTORS: Age >45-55, Genetics, HTN, DM, Tobacco, Obesity, Physical Inactivity.
LIPID LEVELS: Total Cholesterol >200, Triglycerides >=150, LDL >130, HDL <40 (M) / <50 (F).

LIPID-LOWERING DRUG THERAPY:
- Statin Therapy (Lipitor, Pravachol, Crestor, Zocor): Restrict lipoprotein production. Side effects: Liver damage, myopathy.
- Fibric Acid Derivatives (Tricor, Lopid): Restrict lipoprotein production.
- Bile-Acid Sequestrants (Welchol, Colestid): Increase lipoprotein removal.
- Cholesterol Absorption Inhibitor (Zetia): Decrease cholesterol absorption.
- Herbal/OTC: Niacin, Omega-3 Fatty Acid.

COMPLICATIONS: Chronic Stable Angina, ACS (Unstable Angina, MI).`
  },
  {
    id: "cardiac-angina-acs",
    name: "Reference: Angina & ACS",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 2",
    courseId: "Nursing 2",
    content: `ANGINA & ACUTE CORONARY SYNDROME (ACS)
CHEST PAIN = MYOCARDIAL ISCHEMIA: Occurs when O2 demand exceeds supply. Blockage >= 70% usually causes symptoms.

CHRONIC STABLE ANGINA: Intermittent CP with similar pattern. Provoked by exertion/stress. Management: Modifiable risk factors, Drug therapy (Nitrates, Antiplatelets, ACEs, Beta-blockers, CCBs, Statins).

ACUTE CORONARY SYNDROME (ACS):
- Unstable Angina / NSTEMI: Heart Cath & PCI within 12-72 hours. Anticoagulant therapy (Heparin).
- ST-Elevated MI (STEMI): EMERGENCY. Heart Cath & PCI within 90 minutes. Thrombolytic therapy if PCI not available within 30 mins.

ACUTE CARE FOR CHEST PAIN:
1. 12-Lead EKG, vitals, O2, drug therapy.
2. IV access & Cardiac Enzymes (Troponin).
3. Teaching: NTG (Nitro SL) - 1 dose, if no relief in 5 mins call 911, repeat Q5 mins x 3 doses max. Replace every 6 months.

COMPLICATIONS: Heart Failure & Cardiogenic Shock.`
  },
  {
    id: "cardiac-mi",
    name: "Reference: Myocardial Infarction (MI)",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 2",
    courseId: "Nursing 2",
    content: `MYOCARDIAL INFARCTION (MI) - LOCALIZED DAMAGE
CAUSES: Abrupt stoppage of blood flow through coronary artery. STEMI (Occlusive thrombus) vs NSTEMI (Nonocclusive thrombus).

SIGNS & SYMPTOMS:
- Chest Pain: Heavy, tight, crushing. Not relieved by rest/nitro. May radiate to neck, jaw, arm.
- Other: Epigastric discomfort (heartburn), SOB, crackles (if fluid backs up), cool/clammy skin, nausea/vomiting.
- Diabetics may be asymptomatic. Women may have atypical s/s.

DIAGNOSTICS: Elevated Cardiac Enzymes (Troponin), EKG (STEMI vs NSTEMI), Echo (EF, LV dysfunction).

TREATMENT:
1. PCI (Angioplasty/Stenting): 1st line. Within 90 mins for STEMI.
2. Thrombolytic Therapy: Within 30 mins if PCI unavailable.
3. MONA: Morphine, Oxygen, Nitroglycerin, Aspirin.
4. Other: Beta-blockers, ACEs/ARBs, Antidysrhythmics, Statins, Stool softeners.

COMPLICATIONS: Dysrhythmias (most common), Heart Failure, Cardiogenic Shock.`
  },
  {
    id: "cardiac-heart-failure",
    name: "Reference: Heart Failure",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 2",
    courseId: "Nursing 2",
    content: `HEART FAILURE (HF)
PATHOPHYSIOLOGY: Interference with CO. Neurohormonal compensatory mechanisms (SNS, RAAS) lead to remodeling & decreased function.
PRIMARY CAUSES: HTN, CAD, Cardiomyopathy, MI, Valvular disorders.

CLASSIFICATIONS:
- HFrEF (Systolic): Reduced EF, "Pumping problem".
- HFpEF (Diastolic): Preserved EF, "Relaxing & refilling problem".

SYMPTOMS:
- Left-Sided: Dyspnea, pulmonary edema, crackles, cough, fatigue, orthopnea.
- Right-Sided: JVD, peripheral edema, ascites, hepatomegaly, weight gain.

ACUTE DECOMPENSATED HF (ADHF): Sudden increase in symptoms. Requires hospitalization. Pulmonary congestion (Wet) & decreased perfusion (Cold).

TREATMENT:
- Aggressive HTN control, diuretics (furosemide), Beta-blockers, ACEs/ARBs/ARNIs.
- Positive Inotropes (Digoxin, Dobutamine, Dopamine) for "Cold" patients.
- Patient Teaching: Daily weights (report 2-3 lbs/day or 5 lbs/week), Na+ restricted diet, med adherence.`
  },
  {
    id: "cardiac-cardiomyopathy",
    name: "Reference: Cardiomyopathy",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 2",
    courseId: "Nursing 2",
    content: `CARDIOMYOPATHY (GLOBAL DAMAGE)
Group of diseases affecting myocardial structure or function.
- Dilated: Most common. Abnormal widening of LV. Genetic/toxins/HTN.
- Hypertrophic: Abnormal thickening of LV. 2nd most common. Often genetic (young athletes).
- Restrictive: Least common. Abnormal stiffening/decreased flexibility of LV.

SIGNS & SYMPTOMS: Similar to HF (dyspnea, fatigue). S3/S4 heart sounds.
TREATMENT: Focus on controlling HR, enhancing contractility, decreasing preload/afterload.
VENTRICULAR ASSISTIVE DEVICES (LVAD): Long-term support or bridge to transplant. Runs on batteries.`
  },
  {
    id: "cardiac-inflammatory-structural",
    name: "Reference: Inflammatory & Structural Heart Disorders",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 2",
    courseId: "Nursing 2",
    content: `INFLAMMATORY & STRUCTURAL HEART DISORDERS
VALVULAR HEART DISEASE:
- Stenosis: Narrowing (Mitral, Aortic). Back-up of blood.
- Regurgitation: Backflow (Mitral, Aortic).
- Prolapse: Mitral Valve Prolapse (MVP) - leaflets buckle back.
TREATMENT: HF management, Valve replacement (Mechanical - needs lifelong anticoagulation vs Biological - shorter lifespan). TAVR for high-risk patients.

INFLAMMATORY DISORDERS:
- Pericarditis: Inflammation of pericardial sac. Hallmark: Pericardial friction rub. Risk of Cardiac Tamponade.
- Myocarditis: Inflammation of myocardium. Often follows viral infection.
- Endocarditis: Infection of inner lining/valves. Poor prognosis. Requires antibiotic prophylaxis for procedures.
- Rheumatic Heart Disease: Chronic scarring from Rheumatic Fever.`
  },
  {
    id: "cardiac-pvd-pad",
    name: "Reference: PVD & PAD",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 2",
    courseId: "Nursing 2",
    content: `PERIPHERAL VASCULAR DISEASE (PVD)
PERIPHERAL ARTERIAL DISEASE (PAD):
- Causes: Atherosclerosis. Risk factors: Tobacco, DM, HTN, High Cholesterol.
- Characteristics: Intermittent claudication (pain with exercise), decreased/absent pulses, dependent rubor, thin/shiny/taut skin, ulcers on toes/feet (minimal drainage, black eschar).
- The 6 P's (Acute Ischemia): Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia.
- Diagnostics: ABI (<0.90 is PAD), Doppler.
- Treatment: Smoking cessation, exercise, bypass surgery, angioplasty.

CHRONIC VENOUS INSUFFICIENCY (CVI):
- Characteristics: Lower leg edema, dull ache/heaviness, bronze-brown pigmentation, thick/hard/indurated skin, ulcers on medial ankle (large amount of drainage, yellow slough).
- Treatment: Compression therapy, leg elevation.

DEEP VEIN THROMBOSIS (DVT): Thrombus formation. Risk of PE. Tx: Anticoagulants (Heparin, Lovenox, Warfarin), filter.`
  },
  {
    id: "cardiac-inotropes-properties",
    name: "Reference: Positive Inotropes & Heart Properties",
    isEmbedded: true,
    moduleId: "Module 1 - Cardiac Part 2",
    courseId: "Nursing 2",
    content: `POSITIVE INOTROPES & FUNDAMENTAL PROPERTIES
POSITIVE INOTROPES: Increase contractility & CO.
- Cardiac Glycoside: Digoxin. Action: Increase contractility, decrease HR. Watch for Digitalis Toxicity (Anorexia, NVD, Bradycardia, visual disturbances/halos).
- Beta Adrenergic Agonists: Dobutamine, Dopamine.

5 FUNDAMENTAL PROPERTIES OF THE HEART:
1. Inotropy (Contractility): Ability to contract. Positive: Digoxin, Dopamine. Negative: Beta blockers, CCBs.
2. Chronotropy (Automaticity): Heart rate (SA node). Positive: Epinephrine, Atropine. Negative: Digoxin, Beta blockers.
3. Dromotropy (Conductivity): Conduction through AV node. Positive: Epinephrine. Negative: Beta blockers.
4. Bathmotropy (Excitability): Ability to be electrically stimulated.
5. Lusitropy (Repolarization): Ability to relax after contraction.`
  },
  {
    id: "resp-diagnostics",
    name: "Reference: Respiratory Diagnostics",
    isEmbedded: true,
    moduleId: "Module 3 - Respiratory",
    courseId: "Nursing 2",
    content: `RESPIRATORY DIAGNOSTICS
UNDERSTANDING VENTILATION:
- Inspiration (Inhalation): Movement of air into lungs.
- Expiration (Exhalation): Movement of air out of lungs.
- Respiratory Control Center: Medulla responds to PaCO2, PaO2, & pH. Central chemoreceptors respond to H+ concentration (Acidosis/Alkalosis).

DIAGNOSTIC TESTS:
- Oximetry (SpO2): Goal >95%.
- ABGs: pH (7.35-7.45), PaCO2 (35-45), HCO3 (22-26), PaO2 (80-100).
- Capnography (PetCO2): Measurement of exhaled CO2 (40-50).
- Pulmonary Function Tests (PFTs): Measure lung volume & air movement (FEV1).
- Sputum Studies: Identify infecting organism (Gram stain, C/S, Cytology).
- Imaging: CXR, CT (lesions), MRI (vascular), PET (cancer), V/Q Scan (PE), Pulmonary Angiogram.
- Procedures: Thoracentesis (remove fluid), Lung Biopsy, Bronchoscopy (visualize bronchi, obtain biopsy).
- Skin Testing: Mantoux (TB) - Read 48-72 hours. Positive if induration >15mm (no risk) or >5mm (high risk).`
  },
  {
    id: "resp-drugs",
    name: "Reference: Drugs Affecting Ventilation & Oxygenation",
    isEmbedded: true,
    moduleId: "Module 3 - Respiratory",
    courseId: "Nursing 2",
    content: `DRUGS AFFECTING VENTILATION & OXYGENATION
OXYGEN ADMINISTRATION:
- Low-flow: Nasal cannula, Simple mask, Non-rebreather.
- High-flow: High-flow NC, Venti-mask, Tracheostomy collar.

BRONCHODILATORS:
- Beta 2 Agonists: SABA (Albuterol - rescue) vs LABA (Salmeterol - long-term). Side effects: Tachycardia.
- Xanthines (Theophylline): Dilate airways. Many drug interactions.
- Anticholinergics: SAMA (Ipratropium) vs LAMA (Tiotropium). Block PSNS to prevent bronchoconstriction.

ANTI-INFLAMMATORY DRUGS:
- Corticosteroids (Prednisone, Fluticasone): Reduce inflammation. Side effects: Hyperglycemia, weight gain, infection risk.
- Leukotriene Receptor Antagonists (Montelukast): Block leukotrienes (inflammatory messengers).

DRUGS AFFECTING SECRETIONS:
- Expectorants (Guaifenesin): Loosen mucus.
- Mucolytics (Acetylcysteine): Break down chemical structure of mucus.
- Antitussives: Codeine (Opioid - can depress respirations) vs Dextromethorphan (Non-opioid).`
  },
  {
    id: "resp-asthma",
    name: "Reference: Asthma",
    isEmbedded: true,
    moduleId: "Module 3 - Respiratory",
    courseId: "Nursing 2",
    content: `ASTHMA: PERSISTENT AIRWAY INFLAMMATION
PATHOPHYSIOLOGY: Reversible airway obstruction caused by bronchoconstriction, hyperresponsiveness, & edema.
TRIGGERS: Allergens, exercise, air pollutants, respiratory infections.

SIGNS & SYMPTOMS: Wheezing, SOB, dyspnea, chest tightness, cough.
- EMERGENCY: "Silent Chest" (no breath sounds) - indicates severe obstruction.

EXACERBATION TREATMENT:
1. O2 with SABA (Albuterol).
2. Add SAMA (Ipratropium).
3. IV Steroids (Methylprednisolone).

LONG-TERM MANAGEMENT (Stepwise): SABA PRN -> Low-dose ICS -> LABA.
ASTHMA ACTION PLAN:
- Green Zone (80-100%): Well controlled.
- Yellow Zone (50-80%): Caution, use SABA.
- Red Zone (<50%): Serious problem, seek medical help.`
  },
  {
    id: "resp-copd",
    name: "Reference: COPD",
    isEmbedded: true,
    moduleId: "Module 3 - Respiratory",
    courseId: "Nursing 2",
    content: `COPD: CHRONIC BRONCHITIS & EMPHYSEMA
PATHOPHYSIOLOGY: Progressive, non-reversible airflow limitation.
- Chronic Bronchitis: Sputum production for 3 months in 2 consecutive years.
- Emphysema: Destruction of alveoli, loss of elastic recoil.

SIGNS & SYMPTOMS: Barrel chest, tripod position, pursed-lip breathing, wheezes, chronic cough, polycythemia.
DIAGNOSTICS: FEV1/FVC ratio <70%, increased residual volume.

OXYGEN MANAGEMENT: Chronic high PaCO2 levels cause decreased sensitivity to CO2. Stimulus to breathe relies on low O2. Too much O2 (>3L) can decrease the drive to breathe.

EXACERBATION TREATMENT: O2, SABA, SAMA, IV Steroids, Antibiotics.
LONG-TERM MANAGEMENT: SABA PRN, ICS/LABA combination, smoking cessation, vaccinations (Flu/Pneumonia).`
  },
  {
    id: "resp-infections",
    name: "Reference: Respiratory Infections",
    isEmbedded: true,
    moduleId: "Module 3 - Respiratory",
    courseId: "Nursing 2",
    content: `RESPIRATORY INFECTIONS
UPPER RESPIRATORY INFECTIONS: Nose, sinuses, throat (Strep, Flu, RSV).
LOWER RESPIRATORY INFECTIONS: Bronchi & lungs (Pneumonia, TB).

PNEUMONIA: Acute infection of lung parenchyma.
- Classifications: Community-Acquired (CAP), Hospital-Acquired (HAP), Ventilator-Acquired (VAP).
- Signs/Symptoms: Productive cough (green/yellow/rust sputum), fever, chills, dyspnea, crackles.
- Treatment: Antibiotics, O2, hydration, mobility.

TUBERCULOSIS (TB): Caused by Mycobacterium tuberculosis. Airborne transmission.
- Latent vs Active: Latent has no symptoms & is not contagious.
- Signs/Symptoms: Fatigue, malaise, low-grade fever, night sweats, productive cough (mucoid/purulent).
- Diagnostics: Sputum culture (Gold standard), CXR, Mantoux test.
- Treatment: Long-term antimicrobial therapy (6-12 months).

SUPPORTIVE MEASURES: Breathing exercises (Pursed-lip, Diaphragmatic), Airway clearance (Huff coughing, CPT).`
  },
  {
    id: "resp-trauma-cancer",
    name: "Reference: Chest Trauma & Respiratory Cancers",
    isEmbedded: true,
    moduleId: "Module 3 - Respiratory",
    courseId: "Nursing 2",
    content: `CHEST TRAUMA & RESPIRATORY CANCERS
CHEST TRAUMA:
- Fractured Ribs: Pain with inspiration. Risk of Atelectasis & Pneumonia.
- Flail Chest: Fracture of 3+ consecutive ribs in 2 places. Paradoxical chest movement.
- Pneumothorax: Air in pleural cavity. Open vs Closed vs Tension (Medical emergency - tracheal deviation).
- Hemothorax: Blood in pleural cavity.

CHEST TUBES & PLEURAL DRAINAGE:
- Drainage System: Collection chamber, Water seal chamber (tidaling is normal, bubbling indicates leak), Suction control chamber.
- Nursing: Monitor for subcutaneous emphysema/crepitus.

CANCERS OF THE RESPIRATORY SYSTEM:
- Lung Cancer: Non-Small Cell (84%) vs Small Cell (13%). Screening for high-risk (age 50-80 w/ smoking history).
- Signs/Symptoms: Persistent cough, dyspnea, blood-tinged sputum.
- Head/Neck Cancer: Nasal cavity, sinuses, pharynx, larynx. Risk factors: Tobacco, ETOH, HPV.`
  },
  {
    id: "cancer-basics",
    name: "Reference: Cancer Basics & Development",
    isEmbedded: true,
    moduleId: "Module 4 - Cancer",
    courseId: "Nursing 2",
    content: `CANCER BASICS & DEVELOPMENT
WHAT IS CANCER?: Group of diseases characterized by uncontrolled & unregulated growth of cells. Cancer cells do not respect or follow the rules of proliferation (rate of growth) & differentiation (maturing to a functioning state).

DEVELOPMENT OF CANCER:
1. Initiation: Starts with cell mutation. Not reversible. Caused by carcinogens (Radiation, Tobacco, Alcohol, Hormones, Chemicals, Viruses).
2. Promotion: Reversible proliferation of altered cells.
3. Progression: Increased growth rate, tumor develops its own blood supply (Angiogenesis), & metastasis (spread to distant sites like lungs, brain, bone, liver).

CLASSIFICATION & DIAGNOSTICS:
- TNM System: Tumor size (T), Spread to lymph nodes (N), Metastasis (M).
- Grading: I (well differentiated) to IV (undifferentiated/aggressive).
- Biopsy: The only definitive means to diagnose cancer. Histologic examination of tissue.

TREATMENT GOALS:
- Cure: Eradicating the cancer.
- Control: Cannot completely eradicate but responsive to therapies.
- Palliation: Symptom control & maintaining quality of life.`
  },
  {
    id: "cancer-therapies",
    name: "Reference: Cancer Therapies & Complications",
    isEmbedded: true,
    moduleId: "Module 4 - Cancer",
    courseId: "Nursing 2",
    content: `CANCER THERAPIES: RADIATION & CHEMOTHERAPY
RADIATION THERAPY: Localized treatment resulting in cell death.
- External (Teletherapy): Exposure from a machine. Marks placed on skin to outline field.
- Internal (Brachytherapy): Implanted into/close to tumor. Patient is emitting radioactivity.
- Side Effects: Radiation skin reactions (Desquamation). Dry reaction (lubricate with nonirritating lotion) vs Wet reaction (keep clean/protected).

CHEMOTHERAPY: Systemic therapy using chemicals to interfere with cell functions.
- Cell Cycle-Nonspecific (CCNS): Cytotoxic during any phase.
- Cell Cycle-Specific (CCS): Cytotoxic during a specific phase.
- Combination Therapy: Used to maximize cell death & decrease drug resistance.
- Targeted Therapy: Made to find & attack specific areas or substances in cancer cells.

COMPLICATIONS:
- Bone Marrow Suppression: Infection (low WBCs), Hemorrhage (low Platelets), Anemia (low RBCs).
- GI Effects: Nausea/Vomiting, Diarrhea, Mucositis/Stomatitis (inflammation of mouth/throat).
- Other: Alopecia (hair loss), Fatigue.`
  },
  {
    id: "cancer-nursing-care",
    name: "Reference: Nursing Care for Cancer Patients",
    isEmbedded: true,
    moduleId: "Module 4 - Cancer",
    courseId: "Nursing 2",
    content: `NURSING CARE FOR THE PATIENT WITH CANCER
PREVENTING INFECTION: Hand hygiene, reverse isolation (mask), prophylactic antibiotics, Colony Stimulating Factors (Neupogen) for WBCs.

MANAGING SIDE EFFECTS:
- Nausea/Vomiting: Best managed with prevention using Antiemetics (2-3 different drugs). Maintain hydration.
- Nutrition Support: Small, frequent, soft, high-calorie/high-protein meals. Monitor daily weights.
- Mucositis/Stomatitis: Frequent oral care with soft brushes, avoid irritants (alcohol, tobacco, spicy foods), saliva substitutes.
- Fatigue: Energy conservation, rest before activity, activity & rest balance.
- Alopecia: Usually reversible 2-3 months after Tx. Protect head from sun/cold.

PALLIATIVE & END OF LIFE CARE:
- Palliative Care: Focus on comfort & quality of life. Can be concurrent with curative treatment.
- Hospice Care: Focus on comfort for patients with terminal disease (<6 months).
- End of Life Care: Focus on comfort care, pain management (Opioids), & family support.`
  },
  {
    id: "cancer-life-threatening",
    name: "Reference: Life Threatening Cancer Complications",
    isEmbedded: true,
    moduleId: "Module 4 - Cancer",
    courseId: "Nursing 2",
    content: `LIFE THREATENING CANCER COMPLICATIONS
HYPERCALCEMIA: Occurs with bone metastasis.
- S/S: Fatigue, anorexia, N/V, constipation, muscle weakness, ECG changes.
- Tx: Hydration, meds to lower calcium, monitor levels.

TUMOR LYSIS SYNDROME (TLS): Large number of cancer cells dying releases intracellular contents.
- 4 Hallmarks (Electrolyte Imbalances):
  1. Hyperuricemia (High Uric Acid)
  2. Hyperkalemia (High Potassium)
  3. Hyperphosphatemia (High Phosphate)
  4. Hypocalcemia (Low Calcium)
- Tx: Aggressive hydration, Allopurinol (to lower uric acid), & managing electrolyte imbalances.`
  },
  {
    id: "cancer-immune-therapy",
    name: "Reference: Immune Enhancing Drug Therapy",
    isEmbedded: true,
    moduleId: "Module 4 - Cancer",
    courseId: "Nursing 2",
    content: `IMMUNE ENHANCING DRUG THERAPY
BIOLOGIC RESPONSE MODIFIERS: Class of drugs to enhance, direct, or restore the body's immune system.

COLONY STIMULATING FACTORS:
- Erythropoietin (ESA): Epoetin alfa (Procrit). Stimulates RBC production.
- Granulocyte (G-CSF): Filgrastim (Neupogen). Stimulates neutrophil production.
- Granulocyte-Macrophage (GM-CSF): Sargramostim (Leukine).

MONOCLONAL ANTIBODIES: Act like immunotherapy drugs to target specific antigens on cancer cells. Examples: Rituximab, Trastuzumab, Bevacizumab.

OTHER AGENTS:
- Interferons: Antiviral, antiproliferative, & immunomodulatory effects.
- Interleukins (IL-2): Induces proliferation & differentiation of B & T lymphocytes.
- Vaccines: Used to prevent cancer (HBV for Liver, HPV for Cervical).`
  }
];
