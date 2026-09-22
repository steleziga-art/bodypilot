export type ExerciseDetails = {description:string; equipment:string; primary:string[]; secondary:string[]; instructions:string[]};
export const exerciseDetails: Record<string, ExerciseDetails> = {
  "cyg-lever-lying-t-bar-row": {
    "description": "Chest-supported rowing on a plate-loaded T-bar machine.",
    "equipment": "chest supported T-bar row machine",
    "primary": [
      "latissimus_dorsi",
      "rhomboids",
      "middle_trapezius"
    ],
    "secondary": [
      "posterior_deltoid",
      "biceps_brachii"
    ],
    "instructions": [
      "Adjust the chest pad and plant both feet securely.",
      "Keep the chest supported and grip the handles.",
      "Draw the elbows back and bring the handles toward the lower ribs.",
      "Lower the handles under control without lifting the chest from the pad."
    ]
  },
  "ab-wheel-rollout": {
    "description": "A core exercise rolling a wheel forward and back, training anti-extension of the spine.",
    "equipment": "ab wheel",
    "primary": [
      "rectus_abdominis",
      "transverse_abdominis"
    ],
    "secondary": [
      "anterior_deltoid",
      "latissimus_dorsi",
      "obliques",
      "serratus_anterior"
    ],
    "instructions": [
      "Kneel on the floor and grip the ab wheel handles shoulder-width.",
      "Brace the core hard so the lower back stays neutral.",
      "Roll the wheel slowly forward, extending the body as far as you can control.",
      "Stop before the hips sag or the back arches.",
      "Pull the wheel back to the knees by contracting the abs."
    ]
  },
  "air-bike": {
    "description": "A full-body conditioning exercise on the air bike, combining pedaling with an arm push-pull for sustained power output.",
    "equipment": "air bike",
    "primary": [
      "hamstrings",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_maximus",
      "latissimus_dorsi",
      "pectoralis_major",
      "rectus_abdominis"
    ],
    "instructions": [
      "Sit on the air bike and grip the moving handles.",
      "Place your feet on the pedals and brace your core.",
      "Push and pull the handles while pedaling at a steady pace.",
      "Drive with both arms and legs to maintain power output.",
      "Continue for the desired duration or distance."
    ]
  },
  "archer-pull-ups": {
    "description": "A unilateral pull-up shifting the body toward one hand while the other arm stays straight, building single-arm pulling strength.",
    "equipment": "pull up bar",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "forearm_flexors",
      "posterior_deltoid",
      "rhomboids"
    ],
    "instructions": [
      "Grip the bar wider than shoulder width with palms facing away.",
      "Pull yourself up while shifting your body toward one hand.",
      "Keep the opposite arm straight as a support.",
      "Lower yourself under control back to the hang.",
      "Alternate sides each rep or complete reps on one side first."
    ]
  },
  "archer-push-ups": {
    "description": "A wide push-up lowering toward one hand while the opposite arm stays straight, loading one side at a time.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "rectus_abdominis",
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Set up in a wide push-up position with arms straight.",
      "Lower yourself toward one hand while keeping the other arm straight.",
      "Keep your core tight and body in a straight line.",
      "Press back up to the start position.",
      "Alternate sides each rep for the desired number of reps."
    ]
  },
  "arnold-press": {
    "description": "An overhead press variation rotating the palms from facing the body to facing forward, working the front and side deltoids.",
    "equipment": "dumbbell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "serratus_anterior",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Hold a pair of dumbbells at shoulder height with palms facing you.",
      "Press the dumbbells overhead while rotating your palms to face forward.",
      "Fully extend your arms at the top without locking the elbows.",
      "Reverse the motion and rotate back to the start.",
      "Repeat for the desired number of reps."
    ]
  },
  "assisted-dips": {
    "description": "A beginner-friendly dip performed on an assisted machine that offsets body weight, training the chest and triceps.",
    "equipment": "dip machine",
    "primary": [
      "pectoralis_major",
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "rhomboids"
    ],
    "instructions": [
      "Step onto the assisted dip machine with knees on the pad.",
      "Grip the parallel bars and support your weight with straight arms.",
      "Lower your body by bending your elbows until shoulders are below elbows.",
      "Press back up to the start position.",
      "Repeat for the desired number of reps."
    ]
  },
  "assisted-pull-ups": {
    "description": "A machine-assisted pull-up reducing the effective body weight, allowing beginners to train the lats through a full range.",
    "equipment": "assisted pullup machine",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "forearm_flexors",
      "posterior_deltoid",
      "rhomboids"
    ],
    "instructions": [
      "Place your knees on the assisted pull-up machine pad.",
      "Grip the bar with palms facing away, slightly wider than shoulders.",
      "Pull your chest toward the bar by driving your elbows down.",
      "Lower yourself under control to a full hang.",
      "Repeat for the desired number of reps."
    ]
  },
  "back-extension": {
    "description": "An isolation movement targeting the lower back erector spinae on a hyperextension bench.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae"
    ],
    "secondary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "instructions": [
      "Lie face down on a hyperextension bench with hips at the pad edge.",
      "Lower your upper body toward the floor.",
      "Raise your torso back up until your body is straight.",
      "Repeat."
    ]
  },
  "back-lever": {
    "description": "An advanced gymnastic isometric: hanging from a bar, the body is held horizontal and face-down in a straight line, demanding total-body tension through the lats, core, and posterior chain.",
    "equipment": "pull up bar",
    "primary": [
      "erector_spinae",
      "latissimus_dorsi"
    ],
    "secondary": [
      "anterior_deltoid",
      "gluteus_maximus",
      "rectus_abdominis"
    ],
    "instructions": [
      "Hang from a bar with an overhand grip and rotate backward through the arms until inverted.",
      "Lower the body forward and down until it is horizontal, facing the floor.",
      "Keep the arms straight and the whole body in one rigid line from head to heels.",
      "Brace the core and squeeze the glutes so the hips and shoulders do not sag.",
      "Hold for time, then rotate back up under control."
    ]
  },
  "ball-leg-curl": {
    "description": "A bodyweight hamstring curl using a stability ball, rolling the heels toward the glutes while bridging the hips.",
    "equipment": "stability ball",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "gastrocnemius",
      "gluteus_maximus"
    ],
    "instructions": [
      "Lie face-up on the floor with your heels and lower calves on top of a stability ball, arms out for balance.",
      "Press through the heels to raise your hips into a straight line from shoulders to ankles.",
      "Keeping the hips up, bend the knees to roll the ball toward your glutes.",
      "Extend the legs back out under control without dropping the hips.",
      "Complete all reps, then lower the hips and step off the ball."
    ]
  },
  "ball-pike": {
    "description": "An advanced core exercise where the hips pike up while the feet roll a stability ball toward the chest.",
    "equipment": "stability ball",
    "primary": [
      "obliques",
      "rectus_abdominis"
    ],
    "secondary": [
      "anterior_deltoid",
      "hip_flexors",
      "serratus_anterior"
    ],
    "instructions": [
      "Place the shins on a stability ball and hands on the floor in a high plank.",
      "Brace the core and keep the legs straight.",
      "Pike the hips up, rolling the ball toward the chest as the body forms an inverted V.",
      "Pause briefly at the top.",
      "Roll the ball back out to the starting plank."
    ]
  },
  "band-assisted-pull-ups": {
    "description": "A pull-up variation using a resistance band for assistance, reducing the load to build toward unassisted reps.",
    "equipment": "resistance band",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "forearm_flexors",
      "posterior_deltoid",
      "rhomboids"
    ],
    "instructions": [
      "Loop a resistance band over the pull-up bar and step one foot into it.",
      "Grip the bar with palms facing away, shoulder-width apart.",
      "Pull your chest toward the bar by driving your elbows down.",
      "Lower yourself under control to a full hang.",
      "Repeat for the desired number of reps."
    ]
  },
  "band-pull-apart": {
    "description": "A high-volume rear delt and scapular retractor exercise performed by pulling a resistance band apart at shoulder height.",
    "equipment": "resistance band",
    "primary": [
      "posterior_deltoid"
    ],
    "secondary": [
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Stand holding a light resistance band with both hands, arms extended straight in front at shoulder height.",
      "Hands start shoulder-width apart, palms facing down.",
      "Keeping arms straight, pull the band apart by driving the hands out to the sides.",
      "Finish with the band touching your chest and the shoulder blades squeezed together.",
      "Return slowly to the starting position and repeat."
    ]
  },
  "banded-adductor-stretch": {
    "description": "A lying stretch that uses a band to guide one straight leg out to the side and lengthen the inner thigh.",
    "equipment": "resistance band",
    "primary": [
      "adductors"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Lie on your back with a band looped around one foot.",
      "Raise that leg and let it open out to the side.",
      "Hold the band to control how far the leg lowers.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "banded-ankle-stretch": {
    "description": "A seated stretch that uses a band around the forefoot to flex the ankle and lengthen the calf.",
    "equipment": "resistance band",
    "primary": [
      "gastrocnemius"
    ],
    "secondary": [
      "soleus"
    ],
    "instructions": [
      "Sit with one leg extended and a band around the forefoot.",
      "Hold the band in both hands.",
      "Pull so the toes draw back toward your shin.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "banded-calf-stretch": {
    "description": "A lying stretch that uses a band around the ball of the foot to flex the ankle and lengthen the calf.",
    "equipment": "resistance band",
    "primary": [
      "gastrocnemius"
    ],
    "secondary": [
      "soleus"
    ],
    "instructions": [
      "Lie on your back and loop a band around the ball of one foot.",
      "Raise the leg and keep it fairly straight.",
      "Pull the band so your toes draw back toward your shin.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "banded-chest-stretch": {
    "description": "A standing stretch that opens the chest by holding a band behind the back and drawing the arms apart.",
    "equipment": "resistance band",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Hold a band behind your back with both hands.",
      "Straighten your arms and draw them apart.",
      "Lift your chest and squeeze your shoulder blades.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "banded-clamshell": {
    "description": "A clamshell hip-abduction performed with a loop band wrapped above the knees. The band adds constant tension on the gluteus medius — a small, focused isolation drill for hip stability.",
    "equipment": "loop band",
    "primary": [
      "gluteus_medius"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Lie on your side with hips and knees bent to roughly 45 degrees, feet stacked.",
      "Place a loop band around both legs above the knees.",
      "Keep the feet pressed together and the pelvis stable — do not roll back as you move.",
      "Open the top knee upward against the band, like a clamshell opening, until you feel the glute fire.",
      "Pause briefly at the top, then lower under control to the start.",
      "Complete all reps on one side, then switch."
    ]
  },
  "banded-figure-4-stretch": {
    "description": "A lying glute stretch in a figure-4 position, using a band to draw both legs toward the chest.",
    "equipment": "resistance band",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "gluteus_medius"
    ],
    "instructions": [
      "Lie on your back and cross one ankle over the opposite thigh.",
      "Loop a band around the supporting thigh.",
      "Pull both legs toward your chest with the band.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "banded-fire-hydrant": {
    "description": "This isolation exercise uses a loop band to target and strengthen the gluteus medius and maximus, improving hip abduction and stability.",
    "equipment": "loop band",
    "primary": [
      "gluteus_medius"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Place a loop band just above your knees and assume a quadruped position with hands under shoulders and knees under hips.",
      "Keep your core engaged and back flat, maintaining a neutral spine throughout the movement.",
      "Slowly lift one knee out to the side, keeping the knee bent at 90 degrees, until your thigh is parallel to the floor.",
      "Hold briefly at the top, squeezing your glute, then slowly lower your leg back to the starting position with control.",
      "Complete all repetitions on one side before switching to the other side."
    ]
  },
  "banded-glute-bridge": {
    "description": "A glute bridge with a loop band placed above the knees. Driving the knees out against the band recruits the gluteus medius alongside the prime glute-max bridge — a cheap accessory that doubles as hip activation.",
    "equipment": "loop band",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Lie on your back with the knees bent and feet flat on the floor, shoulder-width apart.",
      "Place a loop band around both legs just above the knees.",
      "Press the lower back into the floor and brace the core.",
      "Drive through the heels and squeeze the glutes to lift the hips into a bridge — keep the band tension by pushing the knees outward.",
      "At the top, the body forms a straight line from shoulders to knees. Pause briefly.",
      "Lower under control to the start and repeat for the recommended number of repetitions."
    ]
  },
  "banded-good-morning": {
    "description": "A hip-hinge with a loop band over the upper back, targeting the hamstrings and glutes.",
    "equipment": "loop band",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae"
    ],
    "instructions": [
      "Stand on a loop band with both feet and pass it over the back of your neck.",
      "Set feet hip-width with a soft bend in the knees.",
      "Hinge at the hips, pushing them back with a flat back.",
      "Lower until you feel a stretch in the hamstrings.",
      "Drive the hips forward to return to standing."
    ]
  },
  "banded-hamstring-stretch": {
    "description": "A lying stretch that uses a band around the foot to draw a straight leg toward the torso and lengthen the hamstring.",
    "equipment": "resistance band",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "gastrocnemius"
    ],
    "instructions": [
      "Lie on your back and loop a band around one foot.",
      "Raise that leg straight up, holding the band in both hands.",
      "Gently pull the band to draw the leg toward you.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "banded-hip-thrust": {
    "description": "This exercise uses a loop band to increase glute activation during a hip thrust, effectively targeting the gluteus maximus, hamstrings, and gluteus medius for improved lower body strength.",
    "equipment": "loop band",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Place a loop band just above your knees and sit on the floor with your upper back against a bench.",
      "Bend your knees, plant your feet hip-width apart, and position the band to create tension.",
      "Drive through your heels, extend your hips, and lift your glutes off the floor until your body forms a straight line from shoulders to knees.",
      "Squeeze your glutes forcefully at the top, ensuring your knees are pushed out against the band.",
      "Slowly lower your hips back to the starting position with control."
    ]
  },
  "banded-it-band-stretch": {
    "description": "A lying stretch that uses a band to draw one leg across the body and target the outer thigh and hip.",
    "equipment": "resistance band",
    "primary": [
      "abductors"
    ],
    "secondary": [
      "gluteus_maximus",
      "gluteus_medius"
    ],
    "instructions": [
      "Lie on your back with a band around one raised foot.",
      "Hold the band with the opposite hand.",
      "Draw the straight leg across your body toward the floor.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "banded-kneeling-hip-thrust": {
    "description": "This exercise strengthens the glutes and hamstrings by driving the hips forward against band resistance from a kneeling position.",
    "equipment": "loop band",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Place a loop band just above your knees. Kneel on the floor with your torso upright and knees hip-width apart.",
      "Lean slightly forward from your hips, keeping your back straight and core braced.",
      "Initiate the movement by squeezing your glutes, driving your hips forward until your torso is upright.",
      "Squeeze your glutes hard at the top, maintaining tension on the band.",
      "Slowly reverse the movement, controlling the band's resistance as you return to the starting position."
    ]
  },
  "banded-lat-stretch": {
    "description": "A standing stretch that lengthens the lats by hinging forward while holding a band overhead under tension.",
    "equipment": "resistance band",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "posterior_deltoid"
    ],
    "instructions": [
      "Hold a band overhead with both hands under light tension.",
      "Hinge forward at the hips with your arms reaching ahead.",
      "Let your chest sink to lengthen the sides of your back.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "banded-lateral-walk": {
    "description": "A side-stepping movement performed with a loop band wrapped above the knees or around the ankles. Constant abduction tension fires the gluteus medius — a staple warm-up and rehab drill for hip stability.",
    "equipment": "loop band",
    "primary": [
      "gluteus_medius"
    ],
    "secondary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "instructions": [
      "Place a loop band around the legs above the knees (or around the ankles for a harder version).",
      "Stand in a quarter-squat: feet shoulder-width, hips back, chest up, knees tracking over the toes.",
      "Step one foot directly out to the side against the band tension.",
      "Bring the trailing foot in toward the lead — keep tension on the band the entire time, do not let the feet snap together.",
      "Continue side-stepping in one direction for the prescribed reps or distance, then reverse.",
      "Stay low throughout; do not pop up between steps."
    ]
  },
  "banded-rear-delt-stretch": {
    "description": "A standing stretch that targets the rear shoulder by pulling one arm across the body against band tension.",
    "equipment": "resistance band",
    "primary": [
      "posterior_deltoid"
    ],
    "secondary": [
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Loop a band around one arm and hold the other end.",
      "Draw that arm horizontally across your chest.",
      "Use the band to deepen the pull gently.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "banded-romanian-deadlift": {
    "description": "A Romanian deadlift using a loop band, ideal for warm-ups and learning the hip-hinge pattern.",
    "equipment": "loop band",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae"
    ],
    "instructions": [
      "Stand on a loop band with both feet and grip the top of the band.",
      "Set feet hip-width with a soft bend in the knees.",
      "Hinge at the hips, sliding the hands down the legs.",
      "Lower until you feel a stretch in the hamstrings.",
      "Drive the hips forward to return to standing."
    ]
  },
  "banded-seated-hip-abduction": {
    "description": "This isolation exercise targets the gluteus medius and maximus by externally rotating the hips against band resistance while seated.",
    "equipment": "loop band",
    "primary": [
      "gluteus_medius"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Sit on a bench or chair with a loop band around your knees.",
      "Keep your feet flat on the floor, hip-width apart, and maintain an upright posture.",
      "Push your knees outwards against the band, engaging your glutes.",
      "Hold the peak contraction briefly, then slowly return your knees to the starting position.",
      "Control the movement throughout the entire range of motion."
    ]
  },
  "banded-shoulder-stretch": {
    "description": "A standing stretch that opens the shoulders and chest by holding a band behind the back, one hand high and one low.",
    "equipment": "resistance band",
    "primary": [
      "anterior_deltoid"
    ],
    "secondary": [
      "pectoralis_major"
    ],
    "instructions": [
      "Hold a band behind your back, one hand high and one low.",
      "Keep light tension in the band.",
      "Open your chest and draw your shoulders gently back.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "banded-squat": {
    "description": "A bodyweight squat with a loop band above the knees to teach knees-out tracking.",
    "equipment": "loop band",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Place a loop band just above the knees.",
      "Stand with feet shoulder-width apart, toes slightly out.",
      "Push the knees out against the band as you squat down.",
      "Descend until thighs are parallel or below.",
      "Drive through the heels to stand back up."
    ]
  },
  "banded-standing-curl": {
    "description": "A standing hamstring curl using a loop band anchored around the ankle, useful for travel or as a low-load hamstring finisher.",
    "equipment": "loop band",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "gastrocnemius"
    ],
    "instructions": [
      "Loop a resistance band around one ankle and anchor the other end under your standing foot or a fixed point in front of you.",
      "Stand tall, holding onto something for balance if needed, with a slight bend in the standing knee.",
      "Curl the banded heel up and back toward your glute, keeping the thigh still.",
      "Squeeze the hamstring at the top, then lower under control to a full stretch.",
      "Complete all reps on one side, then switch legs."
    ]
  },
  "banded-standing-hip-abduction": {
    "description": "This isolation exercise targets the gluteus medius and maximus, improving hip stability and strength by abducting the leg against band resistance.",
    "equipment": "loop band",
    "primary": [
      "gluteus_medius"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Place a loop band around your ankles or just above your knees.",
      "Stand tall with a slight bend in your knees and brace your core.",
      "Shift your weight onto one leg, maintaining a stable torso.",
      "Slowly abduct the free leg out to the side, feeling the glute contract.",
      "Control the movement as you return the leg to the starting position.",
      "Complete all reps per side before switching."
    ]
  },
  "banded-standing-hip-adduction": {
    "description": "A standing hip adduction with a loop band, isolating the inner thigh adductors.",
    "equipment": "loop band",
    "primary": [
      "adductors"
    ],
    "secondary": [],
    "instructions": [
      "Anchor a loop band to a sturdy upright at ankle height.",
      "Step into the loop with the working leg facing the anchor side.",
      "Stand a few feet away so the band has tension.",
      "Sweep the working leg across the body toward the standing leg.",
      "Return slowly to the start. Complete reps per side, then switch."
    ]
  },
  "banded-sumo-walk": {
    "description": "A wide-stance lateral walk with a loop band above the knees, targeting the glute medius and maximus.",
    "equipment": "loop band",
    "primary": [
      "gluteus_maximus",
      "gluteus_medius"
    ],
    "secondary": [
      "quadriceps"
    ],
    "instructions": [
      "Place a loop band just above the knees.",
      "Drop into a quarter squat with feet wider than shoulder-width.",
      "Step forward in a wide stance, keeping tension on the band.",
      "Continue stepping forward, alternating feet, for the prescribed distance.",
      "Stay low throughout — do not stand up between steps."
    ]
  },
  "banded-terminal-knee-extension": {
    "description": "An isolation drill that locks out the knee against band resistance, often used for VMO and knee rehab.",
    "equipment": "loop band",
    "primary": [
      "quadriceps"
    ],
    "secondary": [],
    "instructions": [
      "Anchor a loop band to a sturdy upright at knee height.",
      "Step into the loop so the band sits behind one knee.",
      "Step back so the band pulls the knee into a slight bend.",
      "Extend the knee fully against the band, contracting the quad.",
      "Return slowly. Complete reps per side, then switch."
    ]
  },
  "banded-triceps-stretch": {
    "description": "A standing stretch that lengthens the triceps by reaching one hand behind the head against band tension.",
    "equipment": "resistance band",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "latissimus_dorsi"
    ],
    "instructions": [
      "Hold a band that runs down your back, top hand behind your head.",
      "Anchor the lower hand at your lower back.",
      "Reach the top hand down to feel the triceps lengthen.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "barbell-ab-rollout": {
    "description": "A kneeling ab rollout using a loaded barbell with plates, giving smoother rolling and adjustable load compared to an ab wheel.",
    "equipment": "barbell",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "latissimus_dorsi",
      "obliques",
      "transverse_abdominis"
    ],
    "instructions": [
      "Load plates of equal size on both ends of a barbell and place it on the floor.",
      "Kneel behind the bar and grip it shoulder-width, arms extended.",
      "Brace the core hard, then roll the bar forward away from your body.",
      "Go as far as you can keep a neutral spine — stop before the hips sag.",
      "Pull the bar back to the starting position by contracting the abs and lats.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "barbell-calf-raise": {
    "description": "A standing calf raise loaded with a barbell across the upper back, using a raised platform for a deeper heel stretch.",
    "equipment": "barbell",
    "primary": [
      "gastrocnemius"
    ],
    "secondary": [
      "soleus"
    ],
    "instructions": [
      "Place a barbell across your upper back as in a squat.",
      "Stand with the balls of your feet on a raised platform.",
      "Push up onto your toes as high as possible.",
      "Pause and squeeze your calves at the top.",
      "Lower your heels below the platform and repeat."
    ]
  },
  "barbell-curl": {
    "description": "A classic biceps isolation exercise using a barbell for maximal loading.",
    "equipment": "barbell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis",
      "forearm_flexors"
    ],
    "instructions": [
      "Stand holding a barbell with a shoulder-width underhand grip.",
      "Curl the bar up toward your shoulders.",
      "Squeeze at the top, then lower under control.",
      "Repeat."
    ]
  },
  "barbell-front-raise": {
    "description": "An isolation exercise raising a barbell from the thighs to shoulder height, targeting the front deltoids.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid"
    ],
    "secondary": [
      "lateral_deltoid",
      "pectoralis_major",
      "serratus_anterior"
    ],
    "instructions": [
      "Stand holding a barbell with an overhand grip at thigh level.",
      "Keep your arms straight and core braced.",
      "Raise the barbell in front of you to shoulder height.",
      "Pause briefly at the top.",
      "Lower under control and repeat."
    ]
  },
  "barbell-glute-bridge": {
    "description": "A weighted glute bridge using a barbell for increased resistance.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Lie on the floor with a barbell across your hips and knees bent.",
      "Drive your hips up by squeezing your glutes.",
      "Hold at the top with hips fully extended.",
      "Lower with control.",
      "Repeat."
    ]
  },
  "barbell-lunge": {
    "description": "A forward lunge with a barbell across the upper back, training the quads and glutes one leg at a time.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Place a barbell across your upper back and stand tall.",
      "Step forward with one leg into a long stride.",
      "Lower your back knee toward the ground until your front thigh is parallel.",
      "Drive through your front heel to return to standing.",
      "Complete reps on one side, then switch."
    ]
  },
  "barbell-overhead-extension": {
    "description": "This isolation exercise effectively targets the triceps brachii by extending the elbows overhead, promoting muscle hypertrophy and strength.",
    "equipment": "barbell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Load a barbell with an appropriate weight and stand or sit with a neutral spine.",
      "Grip the barbell with an overhand, shoulder-width grip, and press it overhead.",
      "Slowly lower the barbell behind your head by flexing your elbows, keeping your upper arms stable.",
      "Extend your elbows to press the barbell back to the starting overhead position, squeezing your triceps.",
      "Maintain control throughout the movement, avoiding momentum."
    ]
  },
  "barbell-preacher-curl": {
    "description": "This isolation exercise targets the biceps brachii and brachialis by fixing the upper arms on a preacher bench, minimizing momentum and maximizing tension.",
    "equipment": "barbell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis"
    ],
    "instructions": [
      "Sit on a preacher bench with your chest against the pad, gripping a barbell with an underhand, shoulder-width grip.",
      "Position your upper arms firmly against the pad, ensuring your elbows are slightly bent at the start.",
      "Curl the barbell upwards by contracting your biceps, keeping your upper arms stationary on the pad.",
      "Squeeze your biceps at the top of the movement, focusing on peak contraction.",
      "Slowly lower the barbell back to the starting position, controlling the eccentric phase.",
      "Fully extend your arms at the bottom to achieve a complete stretch in the biceps."
    ]
  },
  "barbell-pullover": {
    "description": "A compound movement stretching and loading the lats and chest through a wide arc.",
    "equipment": "barbell",
    "primary": [
      "latissimus_dorsi",
      "pectoralis_major"
    ],
    "secondary": [
      "triceps_brachii"
    ],
    "instructions": [
      "Lie across a bench with a barbell held over your chest.",
      "Lower the bar back over your head in an arc.",
      "Pull it back to the start over your chest.",
      "Repeat."
    ]
  },
  "barbell-rear-delt-row": {
    "description": "A bent-over barbell row with flared elbows that shifts emphasis from the lats to the posterior deltoids and upper back.",
    "equipment": "barbell",
    "primary": [
      "posterior_deltoid"
    ],
    "secondary": [
      "latissimus_dorsi",
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Hinge at the hips with a flat back until your torso is nearly parallel to the floor.",
      "Hold a barbell with an overhand, wider-than-shoulder-width grip, arms hanging.",
      "Row the bar up toward your upper chest with the elbows flaring out to the sides.",
      "Pause and squeeze the rear delts and upper back at the top.",
      "Lower the bar under control and repeat."
    ]
  },
  "barbell-reverse-lunge": {
    "description": "A barbell lunge stepping backward instead of forward, keeping the front shin vertical while loading the quads and glutes.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Place a barbell across your upper back and stand tall.",
      "Step one foot backward into a long stride.",
      "Lower your back knee toward the ground under control.",
      "Drive through your front heel to return to standing.",
      "Complete reps on one side, then switch."
    ]
  },
  "barbell-row": {
    "description": "A compound pulling movement that targets the upper and middle back.",
    "equipment": "barbell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid"
    ],
    "instructions": [
      "Hinge at the hips with a slight knee bend.",
      "Grip the bar slightly wider than shoulder-width.",
      "Pull the bar to your lower chest, squeezing your shoulder blades.",
      "Lower the bar under control.",
      "Repeat."
    ]
  },
  "barbell-wrist-curl": {
    "description": "A barbell wrist curl that isolates the forearm flexors for grip and forearm size.",
    "equipment": "barbell",
    "primary": [
      "forearm_flexors"
    ],
    "secondary": [],
    "instructions": [
      "Sit on a bench with forearms resting on the thighs, palms up.",
      "Hold a barbell with hands shoulder-width, wrists hanging off the knees.",
      "Let the bar roll down to the fingertips at the bottom.",
      "Curl the bar up by flexing the wrists.",
      "Lower under control."
    ]
  },
  "battle-rope-double-slam": {
    "description": "A conditioning movement in which both rope ends are driven up and slammed down together, producing one large wave per rep instead of the alternating waves of the standard battle rope drill.",
    "equipment": "battle rope",
    "primary": [
      "anterior_deltoid",
      "latissimus_dorsi"
    ],
    "secondary": [
      "forearm_flexors",
      "gluteus_maximus",
      "obliques",
      "quadriceps",
      "rectus_abdominis",
      "trapezius"
    ],
    "instructions": [
      "Take one rope end in each hand and face the anchor, standing far enough back that the ropes have a slight slack.",
      "Set your feet slightly wider than your hips and sit into a quarter squat with your chest up.",
      "Swing both arms up together, letting the ropes rise in front of you as you extend through the hips.",
      "Slam both ends down to the floor at the same time, hinging at the hips and driving through your lats.",
      "Ride the rebound straight back into the next slam, keeping both arms moving in unison rather than alternating.",
      "Keep slamming for the desired time or number of reps."
    ]
  },
  "battle-ropes": {
    "description": "A high-intensity conditioning movement using thick ropes, training the upper back, shoulders, and grip.",
    "equipment": "battle rope",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid",
      "latissimus_dorsi"
    ],
    "secondary": [
      "forearm_flexors",
      "quadriceps",
      "rectus_abdominis",
      "trapezius"
    ],
    "instructions": [
      "Anchor the ropes to a fixed point and grab one end in each hand.",
      "Step back so the ropes have moderate slack.",
      "Drop into a quarter squat with feet shoulder-width.",
      "Drive each arm up and down rapidly to send waves through the ropes.",
      "Continue for the prescribed work interval."
    ]
  },
  "bear-crawl": {
    "description": "A quadruped bodyweight crawl on hands and toes with the knees hovering just off the floor, building shoulder stability and core control as you travel forward.",
    "equipment": "bodyweight",
    "primary": [
      "anterior_deltoid",
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques",
      "quadriceps",
      "triceps_brachii"
    ],
    "instructions": [
      "Start on all fours with your hands under your shoulders and knees under your hips.",
      "Tuck your toes and lift your knees a few centimeters off the floor.",
      "Keeping your back flat and hips low, step your right hand and left foot forward together.",
      "Then move your left hand and right foot, crawling forward in a controlled rhythm.",
      "Keep your core braced and your hips from swaying side to side."
    ]
  },
  "behind-the-back-barbell-shrug": {
    "description": "A shrug variation with the barbell held behind the body, targeting the trapezius.",
    "equipment": "barbell",
    "primary": [
      "trapezius"
    ],
    "secondary": [
      "forearm_flexors",
      "rhomboids"
    ],
    "instructions": [
      "Stand holding a barbell behind your back with an overhand grip.",
      "Keep your arms straight and chest up.",
      "Shrug your shoulders straight up toward your ears.",
      "Pause and squeeze at the top.",
      "Lower under control and repeat."
    ]
  },
  "behind-the-neck-lat-pulldown": {
    "description": "A wide-grip lat pulldown taken behind the head, targeting the upper lats and traps — requires full overhead shoulder mobility.",
    "equipment": "lat pulldown machine",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "posterior_deltoid",
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Sit at a lat pulldown station with thighs secured under the pad.",
      "Grip the bar with a wide, overhand grip — wider than shoulder-width.",
      "Keep the torso upright and tuck the chin slightly forward.",
      "Pull the bar down behind the head until it touches the base of the neck.",
      "Return under control to the full overhead stretch.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "behind-the-neck-press": {
    "description": "An overhead press performed with the barbell starting behind the neck, emphasizing the front and side deltoids.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Sit or stand with a barbell resting on your upper traps behind your neck.",
      "Grip the bar wider than shoulder width.",
      "Press the bar straight up overhead until your arms are extended.",
      "Lower the bar back to the starting position under control.",
      "Repeat for the desired number of reps."
    ]
  },
  "behind-the-neck-pull-ups": {
    "description": "A wide-grip pull-up pulled high enough that the bar passes behind the head at the top instead of under the chin, which forces the shoulders into end-range external rotation.",
    "equipment": "pull up bar",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Grip the pull-up bar with an overhand grip wider than shoulder-width and hang at full arm extension with your legs together.",
      "Keep your torso vertical rather than leaning back, and pull your elbows down and out to the sides.",
      "Continue pulling until the bar passes behind your head and the back of your neck comes level with it, without letting the bar touch your neck.",
      "Lower yourself under control back to a full dead hang, keeping your head still rather than letting it snap forward.",
      "Repeat for the desired number of reps."
    ]
  },
  "bench-adductor-stretch": {
    "description": "A standing stretch with one straight leg resting on a bench out to the side to lengthen the inner thigh.",
    "equipment": "flat bench",
    "primary": [
      "adductors"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Stand side-on to a bench.",
      "Rest one straight leg up on the bench out to the side.",
      "Keep your torso upright and shift gently toward the bench.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "bench-ankle-stretch": {
    "description": "A standing stretch with the foot flat on a bench, driving the knee forward over the toes to flex the ankle.",
    "equipment": "flat bench",
    "primary": [
      "gastrocnemius"
    ],
    "secondary": [
      "soleus"
    ],
    "instructions": [
      "Place one whole foot flat on top of a bench.",
      "Keep your torso upright.",
      "Drive that knee forward over your toes.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "bench-bulgarian-split-stretch": {
    "description": "A split-stance stretch with the rear foot on a bench, sinking the hips to open the hip flexors and quad.",
    "equipment": "flat bench",
    "primary": [
      "hip_flexors",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Rest the top of your rear foot on a bench behind you.",
      "Set the front foot flat and bend that knee.",
      "Sink your hips straight down.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "bench-calf-stretch": {
    "description": "A standing stretch with the ball of the foot on a bench edge, dropping the heel to lengthen the calf.",
    "equipment": "flat bench",
    "primary": [
      "gastrocnemius"
    ],
    "secondary": [
      "soleus"
    ],
    "instructions": [
      "Place the ball of one foot on the edge of a bench.",
      "Keep that knee straight.",
      "Let your heel drop down below the toes.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "bench-chest-stretch": {
    "description": "A kneeling stretch with the hands behind on a bench, sinking the hips to open the chest and shoulders.",
    "equipment": "flat bench",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Kneel with your back to a bench.",
      "Place both hands behind you on the edge of the bench.",
      "Sink your hips down to open the chest.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "bench-childs-pose": {
    "description": "A kneeling stretch with the arms resting on a bench, sitting the hips back to lengthen the lats and lower back.",
    "equipment": "flat bench",
    "primary": [
      "erector_spinae",
      "latissimus_dorsi"
    ],
    "secondary": [],
    "instructions": [
      "Kneel on the floor in front of a bench.",
      "Extend both arms forward and rest them on the bench.",
      "Sit your hips back toward your heels and let the chest sink.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "bench-couch-stretch": {
    "description": "A deep quad and hip-flexor stretch with the rear shin running up the front of a bench.",
    "equipment": "flat bench",
    "primary": [
      "hip_flexors",
      "quadriceps"
    ],
    "secondary": [],
    "instructions": [
      "Kneel with your rear shin against the front of a bench.",
      "Place the front foot flat on the floor.",
      "Bring your torso upright until the front of the thigh stretches.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "bench-dips": {
    "description": "A bodyweight pressing movement with hands on a bench behind the body, emphasizing the triceps.",
    "equipment": "bodyweight",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "pectoralis_major"
    ],
    "instructions": [
      "Sit on a bench and place your hands on the edge beside your hips.",
      "Slide your hips off the bench with legs extended.",
      "Lower your body by bending your elbows to 90 degrees.",
      "Press through your palms to return to the start.",
      "Repeat for the desired number of reps."
    ]
  },
  "bench-figure-4-glute-stretch": {
    "description": "A seated stretch on a bench with one ankle crossed over the knee, hinging forward to target the glute.",
    "equipment": "flat bench",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "gluteus_medius"
    ],
    "instructions": [
      "Sit on the end of a bench.",
      "Cross one ankle over the opposite knee.",
      "Keep your back flat and hinge forward over the crossed leg.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "bench-hamstring-stretch": {
    "description": "A standing stretch with the heel on a bench, hinging forward over the straight raised leg to lengthen the hamstring.",
    "equipment": "flat bench",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae"
    ],
    "instructions": [
      "Place one heel on a bench with that leg straight.",
      "Stand tall on the supporting leg.",
      "Hinge forward from the hips over the raised leg.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "bench-lat-stretch": {
    "description": "A kneeling stretch with the hands on a bench, sinking the chest toward the floor to lengthen the lats.",
    "equipment": "flat bench",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "posterior_deltoid"
    ],
    "instructions": [
      "Kneel on the floor in front of a bench.",
      "Place both hands on top of the bench.",
      "Sit your hips back and let your chest sink down.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "bench-leg-pull-in": {
    "description": "A supine core exercise on a flat bench, pulling the knees toward the chest to train the rectus abdominis.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "hip_flexors",
      "obliques"
    ],
    "instructions": [
      "Lie on your back on a flat bench and grip the sides behind your head for support.",
      "Extend your legs straight out with heels just above the bench surface.",
      "Pull your knees toward your chest, lifting the hips slightly off the bench.",
      "Extend the legs back out under control without letting the heels touch the bench.",
      "Repeat for the desired number of repetitions."
    ]
  },
  "bench-press": {
    "description": "A compound pushing movement that targets the chest, shoulders, and triceps.",
    "equipment": "barbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie flat on a bench with your eyes under the bar.",
      "Grip the bar slightly wider than shoulder-width.",
      "Unrack the bar and lower it to your mid-chest.",
      "Press the bar back up to full arm extension.",
      "Repeat for the desired number of reps."
    ]
  },
  "bench-pull": {
    "description": "A rowing exercise performed lying face down on an elevated bench, eliminating body momentum to target the lats and rhomboids.",
    "equipment": "barbell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Lie face down on an elevated bench with arms hanging straight down.",
      "Grip a barbell or dumbbells below you.",
      "Row the weight up to the underside of the bench.",
      "Squeeze your shoulder blades at the top.",
      "Lower under control and repeat."
    ]
  },
  "bent-arm-barbell-pullover": {
    "description": "A pullover variation performed with elbows bent, lowering a barbell behind the head to stretch the lats and chest.",
    "equipment": "barbell",
    "primary": [
      "latissimus_dorsi",
      "pectoralis_major"
    ],
    "secondary": [
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on a bench holding a barbell above your chest with bent elbows.",
      "Keep your elbows bent throughout the movement.",
      "Lower the barbell behind your head in an arc.",
      "Pull the barbell back over your chest using your lats.",
      "Repeat for the desired number of reps."
    ]
  },
  "bent-arm-ez-bar-pullover": {
    "description": "A bent-arm pullover on a flat bench using an EZ-bar — wrist-friendlier than the straight barbell version while keeping the deep lat and pec stretch.",
    "equipment": "ez bar",
    "primary": [
      "latissimus_dorsi",
      "pectoralis_major"
    ],
    "secondary": [
      "posterior_deltoid",
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on a flat bench holding an EZ-bar with a narrow overhand grip on the inner bends.",
      "Start with the bar above your chest, elbows bent to roughly 90 degrees.",
      "Keep the elbow angle fixed and lower the bar back in an arc overhead until a deep stretch is felt in the lats and pecs.",
      "Pull the bar back over the chest along the same arc, without straightening the elbows.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "bent-over-db-row": {
    "description": "A two-arm bent-over row with a dumbbell in each hand. The free movement of independent dumbbells lets the elbows track natural and adds a stability demand that a barbell row hides.",
    "equipment": "dumbbell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Stand with feet hip-width, holding a dumbbell in each hand at the sides, palms facing in.",
      "Hinge at the hips with a flat back until the torso is roughly 30–45 degrees from horizontal, dumbbells hanging directly below the shoulders.",
      "Brace the core and pull both dumbbells up and slightly back, driving the elbows past the ribs.",
      "Squeeze the upper back at the top, keeping the elbows tucked.",
      "Lower under control to the starting position with the arms fully extended.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "bent-over-ez-bar-row": {
    "description": "A horizontal pulling movement with an EZ-bar for a wrist-friendly back rowing exercise.",
    "equipment": "ez bar",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid"
    ],
    "instructions": [
      "Hold an EZ-bar with an overhand grip, hinge at the hips to 45 degrees.",
      "Pull the bar to your lower ribcage.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "bicep-curl": {
    "description": "An isolation exercise targeting the biceps.",
    "equipment": "dumbbell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis",
      "forearm_flexors"
    ],
    "instructions": [
      "Stand holding dumbbells at your sides, palms forward.",
      "Curl the weights up toward your shoulders.",
      "Squeeze at the top, then lower under control.",
      "Repeat."
    ]
  },
  "bicycle-crunch": {
    "description": "A dynamic crunch variation targeting both the rectus abdominis and obliques.",
    "equipment": "bodyweight",
    "primary": [
      "obliques",
      "rectus_abdominis"
    ],
    "secondary": [
      "hip_flexors"
    ],
    "instructions": [
      "Lie on your back with hands behind your head and legs raised.",
      "Bring one knee toward your chest while rotating your torso to meet it with the opposite elbow.",
      "Extend that leg while bringing the other knee in.",
      "Continue alternating in a pedaling motion.",
      "Repeat."
    ]
  },
  "bird-dog": {
    "description": "A core stability exercise extending opposite arm and leg to challenge the erector spinae and deep core.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "transverse_abdominis"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Start on all fours with a neutral spine.",
      "Extend your right arm forward and left leg back simultaneously.",
      "Hold for a moment, then return.",
      "Repeat on the other side.",
      "Alternate."
    ]
  },
  "bird-dog-hold": {
    "description": "A static core hold balancing on all fours with one arm and the opposite leg extended, training spinal stability.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "rectus_abdominis"
    ],
    "secondary": [
      "gluteus_maximus",
      "obliques",
      "posterior_deltoid"
    ],
    "instructions": [
      "Start on all fours with hands under shoulders and knees under hips.",
      "Extend one arm forward and the opposite leg back.",
      "Keep your core tight and body level.",
      "Hold the position without rotating your torso.",
      "Hold for time. Complete on one side, then switch."
    ]
  },
  "boat-pose": {
    "description": "A seated balance on the sit bones with the legs lifted and the chest tall, holding a V shape that loads the hip flexors and the whole front of the trunk.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "erector_spinae",
      "quadriceps"
    ],
    "instructions": [
      "Sit on the floor with the knees bent and the feet flat, hands resting behind the thighs.",
      "Lean back until you balance just behind the sit bones and lift the chest so the spine stays long.",
      "Lift the shins until they are parallel to the floor, then straighten the legs as far as the back stays flat.",
      "Reach the arms forward beside the legs and hold the position for the prescribed time.",
      "Lower the feet under control to finish."
    ]
  },
  "bodyweight-calf-raise": {
    "description": "A beginner-friendly calf raise using body weight only on flat ground, strengthening the gastrocnemius and soleus.",
    "equipment": "bodyweight",
    "primary": [
      "gastrocnemius"
    ],
    "secondary": [
      "soleus"
    ],
    "instructions": [
      "Stand with feet hip-width apart on a flat surface.",
      "Push up onto the balls of your feet as high as possible.",
      "Squeeze your calves at the top.",
      "Lower your heels back to the floor under control.",
      "Repeat for the desired number of reps."
    ]
  },
  "bodyweight-good-morning": {
    "description": "A bodyweight hip hinge with hands behind the head, strengthening the hamstrings and spinal erectors.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "hamstrings"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Stand with feet hip-width apart and hands behind your head.",
      "Keep a slight bend in your knees and brace your core.",
      "Hinge at the hips and lower your torso toward parallel.",
      "Drive your hips forward to return to standing.",
      "Repeat for the desired number of reps."
    ]
  },
  "bodyweight-lateral-raise": {
    "description": "A shoulder isolation movement performed without equipment to develop lateral deltoid width.",
    "equipment": "bodyweight",
    "primary": [
      "lateral_deltoid"
    ],
    "secondary": [
      "anterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Stand upright with arms hanging at your sides.",
      "Raise both arms out to the sides with a slight elbow bend until parallel with the floor.",
      "Pause briefly at the top.",
      "Lower slowly back to the starting position.",
      "Repeat for the desired reps."
    ]
  },
  "bodyweight-overhead-press": {
    "description": "A bodyweight press performed in a pike position facing a wall, replicating the overhead pressing pattern with the shoulders and triceps.",
    "equipment": "bodyweight",
    "primary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "secondary": [
      "serratus_anterior",
      "trapezius"
    ],
    "instructions": [
      "Stand facing a wall in a pike position with hands on the ground.",
      "Walk your feet closer for a more vertical body line.",
      "Lower your head toward the floor by bending your elbows.",
      "Press through your hands to extend your arms.",
      "Repeat for the desired number of reps."
    ]
  },
  "bodyweight-reverse-lunge": {
    "description": "A lunge variation using only body weight, stepping backward for better knee stability than a forward lunge.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Stand tall with your feet hip-width apart.",
      "Step one leg back and lower your knee toward the floor.",
      "Lower until your front thigh is parallel to the floor.",
      "Push through your front heel to return to standing.",
      "Repeat on both sides."
    ]
  },
  "bodyweight-squat": {
    "description": "A foundational lower-body exercise squatting with body weight only, developing the quadriceps, glutes, and basic movement mechanics.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart and arms extended forward.",
      "Sit back and down by bending your hips and knees.",
      "Lower until your thighs are parallel to the floor.",
      "Drive through your heels to return to standing.",
      "Repeat for the desired number of reps."
    ]
  },
  "bow-pose": {
    "description": "A prone backbend in which the hands hold the ankles and the legs press away, lifting the chest and thighs off the floor and loading the whole back line.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings",
      "pectoralis_major"
    ],
    "instructions": [
      "Lie face down with the arms beside the body and the forehead resting on the mat.",
      "Bend the knees and take hold of the outside of both ankles.",
      "Press the shins back into the hands so the chest and thighs lift away from the floor.",
      "Hold the lifted position for the prescribed time, keeping the neck long and the gaze forward.",
      "Release the ankles and lower down under control."
    ]
  },
  "box-jump": {
    "description": "A plyometric jump from a quarter-squat onto a stable box, training lower-body power.",
    "equipment": "plyo box",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gastrocnemius",
      "hamstrings",
      "soleus"
    ],
    "instructions": [
      "Stand a foot in front of a sturdy box with feet shoulder-width.",
      "Drop into a quarter-squat and swing the arms back.",
      "Drive the arms up and explode off the floor onto the box.",
      "Land softly with both feet flat and knees bent.",
      "Step down — do not jump down — and reset."
    ]
  },
  "box-squat": {
    "description": "A squat performed to a box or bench, which fixes the depth and teaches sitting back into the hips.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand in front of a box or bench, feet shoulder-width apart, with your arms extended forward for balance.",
      "Push your hips back and bend your knees, sitting back toward the box rather than straight down.",
      "Touch the box lightly with your glutes without collapsing onto it.",
      "Drive through your feet to stand back up, squeezing your glutes at the top.",
      "Repeat for the desired number of reps."
    ]
  },
  "bulgarian-split-squat": {
    "description": "A single-leg squat variation with the rear foot elevated.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Stand in front of a bench, place one foot behind you on the bench.",
      "Hold dumbbells at your sides.",
      "Lower your body until your front thigh is parallel to the floor.",
      "Push through your front heel to stand back up.",
      "Repeat on both sides."
    ]
  },
  "burpees": {
    "description": "A full-body conditioning movement combining a squat, plank, push-up, and jump.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "pectoralis_major",
      "quadriceps"
    ],
    "secondary": [
      "anterior_deltoid",
      "rectus_abdominis",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart.",
      "Squat down and place the hands on the floor in front of you.",
      "Jump or step the feet back into a plank, then perform a push-up.",
      "Jump or step the feet forward to the hands.",
      "Stand up and jump explosively, reaching the arms overhead."
    ]
  },
  "butterfly-stretch": {
    "description": "A seated stretch for the inner thighs, pressing the soles of the feet together with the knees dropped out.",
    "equipment": "bodyweight",
    "primary": [
      "adductors"
    ],
    "secondary": [
      "hip_flexors"
    ],
    "instructions": [
      "Sit tall and press the soles of your feet together.",
      "Let your knees drop out toward the floor.",
      "Hold your feet and sit up tall.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "cable-bent-over-row": {
    "description": "A cable rowing variation providing constant tension throughout the movement.",
    "equipment": "cable",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid"
    ],
    "instructions": [
      "Attach a straight or V-bar to a low cable pulley.",
      "Hinge at the hips with knees slightly bent.",
      "Pull the handle toward your lower chest.",
      "Squeeze your shoulder blades at the top.",
      "Lower with control and repeat."
    ]
  },
  "cable-chest-press": {
    "description": "A standing chest press on the cable machine, providing constant tension while the staggered stance demands core stability.",
    "equipment": "cable",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Set the cables to chest height and face away from the machine.",
      "Grip a handle in each hand and step forward into a staggered stance.",
      "Press the handles forward until your arms are extended.",
      "Squeeze your chest at the top.",
      "Return under control and repeat."
    ]
  },
  "cable-crunch": {
    "description": "A kneeling abdominal exercise flexing the spine against cable resistance, allowing progressive loading of the rectus abdominis.",
    "equipment": "cable",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques",
      "transverse_abdominis"
    ],
    "instructions": [
      "Kneel in front of a cable machine with a rope attachment at the top.",
      "Hold the rope near your forehead with elbows bent.",
      "Crunch down by flexing your spine and bringing your elbows to your thighs.",
      "Squeeze your abs hard at the bottom.",
      "Return to the start position and repeat."
    ]
  },
  "cable-curl": {
    "description": "A bicep curl using cable resistance for constant tension.",
    "equipment": "cable",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis"
    ],
    "instructions": [
      "Stand facing a low cable pulley with a straight bar or EZ-bar attachment.",
      "Grip the bar with an underhand grip, elbows at your sides.",
      "Curl the bar up toward your shoulders.",
      "Lower with control.",
      "Repeat."
    ]
  },
  "cable-external-rotation": {
    "description": "A cable exercise rotating the forearm outward with the elbow pinned at the side, strengthening the rear delts.",
    "equipment": "cable",
    "primary": [
      "posterior_deltoid"
    ],
    "secondary": [
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Set a cable pulley to elbow height and grip the handle.",
      "Stand side-on to the machine with your working elbow bent at 90 degrees.",
      "Keep your elbow glued to your side and rotate your forearm outward.",
      "Pause at the end of the movement.",
      "Return under control. Complete reps on one side, then switch."
    ]
  },
  "cable-fly": {
    "description": "An isolation movement for the chest using cable resistance for constant tension.",
    "equipment": "cable",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Stand between two cable columns with handles attached to high pulleys.",
      "With a slight bend in your elbows, open your arms wide.",
      "Bring your hands together in front of your chest in a hugging motion.",
      "Slowly return to the starting position.",
      "Repeat."
    ]
  },
  "cable-front-raise": {
    "description": "An isolation exercise raising a cable handle to shoulder height, keeping constant tension on the front delt.",
    "equipment": "cable",
    "primary": [
      "anterior_deltoid"
    ],
    "secondary": [
      "lateral_deltoid",
      "pectoralis_major"
    ],
    "instructions": [
      "Stand facing away from a low cable pulley with a handle attachment.",
      "Hold the handle with arm extended at your thigh.",
      "Raise your arm forward to shoulder height keeping it straight.",
      "Pause at the top.",
      "Lower under control and repeat."
    ]
  },
  "cable-hammer-curl": {
    "description": "A cable curl using a rope attachment with a neutral grip to target the brachialis and brachioradialis with constant tension.",
    "equipment": "cable",
    "primary": [
      "biceps_brachii",
      "brachialis",
      "brachioradialis"
    ],
    "secondary": [
      "forearm_flexors"
    ],
    "instructions": [
      "Attach a rope to a low cable pulley and stand facing the machine.",
      "Grip the rope with a neutral (hammer) grip, palms facing each other.",
      "Curl the rope upward toward your shoulders, keeping elbows pinned at your sides.",
      "Squeeze at the top, then lower slowly to full extension.",
      "Repeat for the desired reps."
    ]
  },
  "cable-kickback": {
    "description": "A cable isolation exercise for the glutes, extending the hip back against constant resistance.",
    "equipment": "cable",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Attach an ankle cuff to a low cable pulley and fasten it around one ankle.",
      "Stand facing the machine, holding the frame lightly for balance, and hinge slightly forward at the hips.",
      "Kick the cuffed leg straight back, extending the hip fully while keeping the knee nearly straight.",
      "Squeeze the glute at full hip extension, then return the foot slowly to the start.",
      "Complete all reps on one side before switching."
    ]
  },
  "cable-lateral-raise": {
    "description": "A unilateral lateral raise on the cable, providing constant tension on the side delt.",
    "equipment": "cable",
    "primary": [
      "lateral_deltoid"
    ],
    "secondary": [
      "anterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Stand sideways to a low pulley, grip the handle with the outside hand.",
      "Keep a soft bend in the elbow and the cable in front of the working leg.",
      "Raise the arm out to the side until parallel to the floor.",
      "Lower under control. Complete reps per side, then switch.",
      "Maintain tension — do not let the weight rest at the bottom."
    ]
  },
  "cable-pallof-press": {
    "description": "An anti-rotation core exercise in which a cable pulls you sideways while you press a handle straight out from your chest and refuse to let your torso turn.",
    "equipment": "cable",
    "primary": [
      "obliques",
      "transverse_abdominis"
    ],
    "secondary": [
      "anterior_deltoid",
      "erector_spinae",
      "gluteus_medius",
      "rectus_abdominis"
    ],
    "instructions": [
      "Set a cable at chest height and take the handle in both hands, standing side-on to the machine.",
      "Step away until there is real tension on the cable, with your feet about shoulder-width apart and knees softly bent.",
      "Bring the handle to the centre of your chest and brace your trunk and glutes.",
      "Press the handle straight out in front of you until your arms are extended, resisting the pull that wants to rotate you toward the machine.",
      "Hold the extended position for a moment, then bring the handle back to your chest under control.",
      "Complete the desired reps, then turn around and repeat facing the other way."
    ]
  },
  "cable-tricep-kickback": {
    "description": "An isolation movement performed hinged forward, extending the elbow against cable resistance to work the triceps.",
    "equipment": "cable",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "posterior_deltoid"
    ],
    "instructions": [
      "Attach a handle to a low cable and hinge forward at the hips.",
      "Tuck your upper arm against your side with elbow bent 90 degrees.",
      "Extend your elbow to push the handle back behind you.",
      "Squeeze your triceps at the end of the movement.",
      "Return under control. Complete reps on one side, then switch."
    ]
  },
  "cable-upright-row": {
    "description": "An upright row performed with a cable for constant tension on the lateral deltoids and traps.",
    "equipment": "cable",
    "primary": [
      "lateral_deltoid",
      "trapezius"
    ],
    "secondary": [
      "anterior_deltoid",
      "biceps_brachii"
    ],
    "instructions": [
      "Stand in front of a cable machine and grip a straight bar or rope at thigh height.",
      "Pull the bar up toward your chin, leading with your elbows.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "cable-wrist-curl": {
    "description": "An isolation exercise flexing the wrists against cable resistance to strengthen the forearm flexors.",
    "equipment": "cable",
    "primary": [
      "forearm_flexors"
    ],
    "secondary": [],
    "instructions": [
      "Attach a straight bar to a low cable pulley.",
      "Kneel or sit with forearms on a bench, palms facing up.",
      "Let your wrists flex off the bench edge.",
      "Curl the bar up by flexing your wrists.",
      "Lower under control and repeat."
    ]
  },
  "camel-pose": {
    "description": "A kneeling backbend that opens the front of the hips, the abdomen and the chest while the hands support the position on the heels or the lower back.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "hip_flexors"
    ],
    "secondary": [
      "pectoralis_major",
      "quadriceps"
    ],
    "instructions": [
      "Kneel with the knees hip-width apart and the hips stacked over the knees.",
      "Place the hands on the back of the pelvis with the fingers pointing down and lift the chest.",
      "Press the hips forward and arch back, reaching for the heels if the position stays comfortable.",
      "Hold the pose for the prescribed time, keeping the neck in line with the spine.",
      "Bring the hands back to the pelvis and come up chest-first."
    ]
  },
  "captains-chair-knee-raise": {
    "description": "A bodyweight core exercise performed on a captain's chair that targets the lower abs and hip flexors.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques",
      "transverse_abdominis"
    ],
    "instructions": [
      "Position yourself in the captain's chair with your back flat against the pad and forearms on the armrests.",
      "Let your legs hang straight down.",
      "Engage your core and raise your knees toward your chest.",
      "Hold briefly at the top, then lower slowly to the starting position.",
      "Repeat for the desired reps."
    ]
  },
  "captains-chair-leg-raise": {
    "description": "A bodyweight core exercise on a captain's chair that targets the lower abs and hip flexors with straight legs for greater difficulty.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques",
      "transverse_abdominis"
    ],
    "instructions": [
      "Position yourself in the captain's chair with your back flat against the pad and forearms on the armrests.",
      "Let your legs hang straight down.",
      "Keeping your legs straight, raise them until parallel with the floor or higher.",
      "Hold briefly at the top, then lower slowly.",
      "Repeat for the desired reps."
    ]
  },
  "cat-cow": {
    "description": "A kneeling flow that alternates between rounding the spine towards the ceiling and letting it sag while the chest opens, moving every segment of the back through its range.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "rectus_abdominis"
    ],
    "secondary": [
      "transverse_abdominis",
      "trapezius"
    ],
    "instructions": [
      "Start on all fours with the hands under the shoulders and the knees under the hips.",
      "Exhale and round the spine towards the ceiling, tucking the tailbone and letting the head drop.",
      "Inhale and reverse it: let the belly sink, lift the chest and tailbone, and look slightly forward.",
      "Move between the two shapes slowly, one breath per position.",
      "Finish in a neutral spine and sit back onto the heels."
    ]
  },
  "cat-stretch": {
    "description": "A kneeling stretch that rounds the spine upward to lengthen the back muscles.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae"
    ],
    "secondary": [
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Start on all fours, hands under shoulders and knees under hips.",
      "Round your spine up toward the ceiling.",
      "Tuck your chin toward your chest.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "chair-pose": {
    "description": "A standing hold with the hips sunk back and the arms overhead, so the quadriceps and the upper back work isometrically against bodyweight.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "anterior_deltoid",
      "erector_spinae"
    ],
    "instructions": [
      "Stand with the feet together or hip-width apart and the weight in the heels.",
      "Bend the knees and send the hips back as if sitting down onto a chair.",
      "Raise the arms overhead beside the ears, keeping the ribs from flaring.",
      "Hold the position for the prescribed time with the chest lifted and the knees tracking over the toes.",
      "Press through the heels to stand back up."
    ]
  },
  "cheat-curl": {
    "description": "A momentum-assisted bicep curl using slight hip drive on the way up and a slow, controlled lowering phase.",
    "equipment": "barbell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis",
      "brachioradialis",
      "erector_spinae"
    ],
    "instructions": [
      "Stand holding weight at thigh level with an underhand grip.",
      "Use a slight hip drive to start the curl.",
      "Curl the weight up toward your shoulders explosively.",
      "Lower the weight slowly under control through the full range.",
      "Repeat for the desired number of reps."
    ]
  },
  "chest-press-machine": {
    "description": "A machine-based pressing movement for the chest, ideal for beginners.",
    "equipment": "chest press machine",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Sit in the machine with your back flat against the pad.",
      "Grip the handles at chest level.",
      "Push the handles forward until your arms are fully extended.",
      "Slowly return to the starting position.",
      "Repeat."
    ]
  },
  "chest-supported-db-row": {
    "description": "A dumbbell row with chest support to eliminate lower back strain and isolate the back muscles.",
    "equipment": "dumbbell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid"
    ],
    "instructions": [
      "Lie face-down on an incline bench with dumbbells hanging beneath.",
      "Row the dumbbells up to your sides.",
      "Squeeze at the top, then lower.",
      "Repeat."
    ]
  },
  "chest-supported-dumbbell-shrug": {
    "description": "A shrug performed face-down on an incline bench, the chest support isolating the traps and removing momentum.",
    "equipment": "dumbbell",
    "primary": [
      "trapezius"
    ],
    "secondary": [
      "posterior_deltoid",
      "rhomboids"
    ],
    "instructions": [
      "Set an incline bench to about 30 degrees.",
      "Lie face down on the bench holding dumbbells at arm's length.",
      "Shrug your shoulders up and back toward your ears.",
      "Squeeze your upper traps at the top.",
      "Lower under control and repeat."
    ]
  },
  "chest-supported-kettlebell-row": {
    "description": "This exercise targets your back muscles, primarily the latissimus dorsi and rhomboids, by pulling a kettlebell towards your chest while your torso is supported.",
    "equipment": "kettlebell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Lie face down on an incline bench, allowing your arms to hang freely with a kettlebell in each hand.",
      "Brace your core and retract your shoulder blades.",
      "Pull the kettlebells towards your hips, squeezing your shoulder blades together.",
      "Pause briefly at the top, feeling the contraction in your back.",
      "Slowly lower the kettlebells back to the starting position with control."
    ]
  },
  "chest-supported-smith-machine-row": {
    "description": "A row performed against an inclined pad inside the Smith machine, where the chest support removes the lower back from the movement and the guided bar keeps the pull in one line.",
    "equipment": "smith machine",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid"
    ],
    "instructions": [
      "Set an incline bench inside the Smith machine facing the bar, and set the bar low enough that your arms hang straight when you lean on the pad.",
      "Stand astride the bench with your feet planted and your chest resting against the top of the pad.",
      "Take an overhand grip a little wider than shoulder-width and unhook the bar with your arms extended.",
      "Pull the bar up to your lower chest, leading with your elbows and squeezing the shoulder blades together at the top.",
      "Lower the bar under control until your arms are straight again, and repeat for the desired number of repetitions."
    ]
  },
  "childs-pose": {
    "description": "A kneeling rest stretch that lengthens the lats, lower back and shoulders with the arms reaching forward.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "latissimus_dorsi"
    ],
    "secondary": [
      "trapezius"
    ],
    "instructions": [
      "Kneel and sit your hips back toward your heels.",
      "Fold your torso forward over your thighs.",
      "Reach both arms out long on the floor in front.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "chin-tuck-hold": {
    "description": "A static neck drill that retracts the head straight back to strengthen the deep neck flexors and counter forward-head posture.",
    "equipment": "bodyweight",
    "primary": [
      "trapezius"
    ],
    "secondary": [
      "rhomboids"
    ],
    "instructions": [
      "Stand or sit tall with your shoulders relaxed.",
      "Pull your chin straight back, creating a double chin.",
      "Keep your head level without tilting.",
      "Hold the position for the desired duration.",
      "Release and repeat for multiple sets."
    ]
  },
  "chin-ups": {
    "description": "A supinated-grip pull-up that strongly activates the biceps alongside the lats.",
    "equipment": "pull up bar",
    "primary": [
      "biceps_brachii",
      "latissimus_dorsi"
    ],
    "secondary": [
      "rhomboids"
    ],
    "instructions": [
      "Hang from a bar with a shoulder-width underhand grip.",
      "Pull yourself up until chin is above the bar.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "clamshells": {
    "description": "A side-lying hip exercise opening the top knee against gravity to activate the gluteus medius.",
    "equipment": "bodyweight",
    "primary": [
      "abductors",
      "gluteus_medius"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Lie on your side with knees bent and stacked on top of each other.",
      "Keep your feet together and hips stacked.",
      "Open your top knee toward the ceiling without rotating your hips.",
      "Squeeze your outer glute at the top.",
      "Lower under control. Complete reps on one side, then switch."
    ]
  },
  "clamshells-hold": {
    "description": "The top position of the clamshell held for time: lying on one side with the knees bent and stacked, the upper knee lifted and the pelvis square, so the glute medius works isometrically instead of through repetitions.",
    "equipment": "bodyweight",
    "primary": [
      "abductors",
      "gluteus_medius"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Lie on one side with the hips and knees bent about 45 and 90 degrees, heels together and knees stacked.",
      "Stack the shoulders and hips vertically and brace the trunk so the pelvis cannot roll backwards.",
      "Open the upper knee as far as it goes without the pelvis rotating, keeping the heels touching.",
      "Hold that open position for the prescribed time, breathing normally.",
      "Lower the knee under control and repeat on the other side."
    ]
  },
  "clap-push-ups": {
    "description": "An explosive plyometric push-up developing chest power and fast-twitch muscle fibers.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "triceps_brachii"
    ],
    "instructions": [
      "Begin in a standard push-up position.",
      "Lower your chest to the floor.",
      "Explosively push up so hands leave the ground.",
      "Clap your hands together and land softly, returning to start.",
      "Repeat."
    ]
  },
  "clean": {
    "description": "An Olympic lift pulling a barbell explosively from the floor to the front-rack position on the shoulders.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "anterior_deltoid",
      "erector_spinae",
      "hamstrings",
      "trapezius"
    ],
    "instructions": [
      "Stand over a loaded barbell with feet hip-width apart.",
      "Grip the bar just outside your knees with an overhand grip.",
      "Drive explosively through your legs and extend your hips.",
      "Pull yourself under the bar and catch it on your front deltoids.",
      "Stand fully upright to complete the lift."
    ]
  },
  "clean-and-jerk": {
    "description": "A two-part Olympic lift cleaning a barbell to the shoulders, then driving it overhead in a split stance.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid",
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Pull a loaded barbell from the floor to your shoulders as in a clean.",
      "Stand fully with the bar racked on your front delts.",
      "Dip slightly and drive the bar overhead explosively.",
      "Split your legs to receive the bar with arms locked out.",
      "Recover by stepping your feet back together."
    ]
  },
  "close-grip-barbell-curl": {
    "description": "A standing barbell curl with a narrow grip, biasing the long head of the biceps and the brachialis.",
    "equipment": "barbell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis",
      "brachioradialis"
    ],
    "instructions": [
      "Stand holding a barbell with an underhand grip, hands closer than shoulder-width apart.",
      "Start with the bar at the thighs, arms extended, elbows tucked to the sides.",
      "Curl the bar up to the shoulders by flexing the elbows.",
      "Squeeze the biceps at the top, then lower under control.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "close-grip-bench-press": {
    "description": "A bench press variation with a narrow grip that shifts the emphasis to the triceps.",
    "equipment": "barbell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "pectoralis_major"
    ],
    "instructions": [
      "Lie on a flat bench and grip the barbell with hands shoulder-width apart.",
      "Lower the bar to your lower chest keeping elbows close to your sides.",
      "Press back up to full extension.",
      "Repeat."
    ]
  },
  "close-grip-db-bench-press": {
    "description": "A dumbbell bench press with dumbbells held together to increase triceps involvement.",
    "equipment": "dumbbell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "pectoralis_major"
    ],
    "instructions": [
      "Lie on a flat bench and hold two dumbbells together over your chest.",
      "Lower them to your chest keeping elbows close.",
      "Press back up.",
      "Repeat."
    ]
  },
  "close-grip-ez-bar-bench-press": {
    "description": "A triceps-focused press using an EZ-bar with a narrow grip for wrist comfort.",
    "equipment": "ez bar",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "pectoralis_major"
    ],
    "instructions": [
      "Lie on a flat bench and grip the inner curves of the EZ-bar.",
      "Lower the bar to your chest with elbows tucked.",
      "Press back up to full extension.",
      "Repeat."
    ]
  },
  "close-grip-ez-bar-curl": {
    "description": "An EZ-bar biceps curl with hands close together, biasing the long head of the biceps.",
    "equipment": "ez bar",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis"
    ],
    "instructions": [
      "Stand holding an EZ-bar with hands on the inner bends, palms up.",
      "Keep the elbows tucked at the sides.",
      "Curl the bar up to shoulder level, squeezing the biceps.",
      "Lower under control to a full stretch.",
      "Repeat for the prescribed reps."
    ]
  },
  "close-grip-incline-bench": {
    "description": "An incline bench press with a close grip targeting the triceps and upper chest.",
    "equipment": "barbell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "pectoralis_major"
    ],
    "instructions": [
      "Set bench to an incline. Grip the barbell with hands shoulder-width or closer.",
      "Lower the bar to your upper chest.",
      "Press back up.",
      "Repeat."
    ]
  },
  "close-grip-lat-pulldown": {
    "description": "A lat pulldown variation using a close, parallel-grip handle to emphasize the lower lats and biceps.",
    "equipment": "cable",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "brachialis",
      "posterior_deltoid",
      "rhomboids"
    ],
    "instructions": [
      "Sit at a lat pulldown machine and secure your thighs under the pad.",
      "Grip the close-grip handle with palms facing each other.",
      "Pull the handle down to your upper chest.",
      "Squeeze your lats at the bottom.",
      "Return under control and repeat."
    ]
  },
  "close-grip-pull-ups": {
    "description": "A pull-up with a narrow overhand grip that increases biceps and inner-back activation.",
    "equipment": "pull up bar",
    "primary": [
      "biceps_brachii",
      "latissimus_dorsi"
    ],
    "secondary": [
      "rhomboids"
    ],
    "instructions": [
      "Hang from a pull-up bar with hands shoulder-width or narrower, palms away.",
      "Pull yourself up until chin clears the bar.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "close-grip-push-ups": {
    "description": "A push-up variation with hands placed close together to emphasize the triceps.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major",
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "serratus_anterior"
    ],
    "instructions": [
      "Assume a push-up position with hands directly under your shoulders.",
      "Keep your elbows tucked close to your ribs.",
      "Lower your chest toward the floor.",
      "Press back up to the starting position.",
      "Repeat for the desired number of reps."
    ]
  },
  "close-stance-leg-press": {
    "description": "A leg press with the feet set close together, increasing knee flexion and keeping the quadriceps prominent while the back remains supported against the pad.",
    "equipment": "leg press",
    "primary": [
      "quadriceps"
    ],
    "secondary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "instructions": [
      "Set the seat and back pad so your lower back stays supported throughout the repetition.",
      "Place your feet close together near the middle of the platform, with the toes and knees pointing along the same line.",
      "Lower the sled by bending the knees and hips while keeping both feet flat and the knees tracking over the toes.",
      "Press the platform away through the whole foot until the legs are extended without snapping the knees straight.",
      "Return under control and repeat for the desired number of repetitions."
    ]
  },
  "cobra-stretch": {
    "description": "A prone backbend that stretches the abdominals and front of the torso by lifting the chest.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "hip_flexors",
      "transverse_abdominis"
    ],
    "instructions": [
      "Lie face down with your hands under your shoulders.",
      "Press through your hands to lift your chest off the floor.",
      "Keep your hips and legs on the floor, shoulders relaxed.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "cocoons": {
    "description": "A dynamic ab exercise combining a knee tuck and an upper-body crunch from a full-body extended position.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "hip_flexors",
      "obliques"
    ],
    "instructions": [
      "Lie face-up on the floor with arms extended overhead and legs extended, hovering slightly off the floor.",
      "Simultaneously tuck the knees toward the chest and sweep the arms forward into a crunch.",
      "Try to touch the hands to the shins at the top.",
      "Reverse the motion smoothly, re-extending arms and legs back to the hover.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "concentration-curl": {
    "description": "An isolation curl performed seated for peak bicep contraction.",
    "equipment": "dumbbell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis"
    ],
    "instructions": [
      "Sit on a bench with legs spread, holding a dumbbell in one hand.",
      "Brace your elbow against the inside of your thigh.",
      "Curl the dumbbell up toward your shoulder.",
      "Lower with control.",
      "Repeat on both sides."
    ]
  },
  "cossack-squat": {
    "description": "A wide-stance lateral squat that sinks the body deep over one bent leg while the other stays straight, training single-leg strength, hip mobility, and adductor flexibility.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "adductors",
      "hamstrings"
    ],
    "instructions": [
      "Stand in a wide stance with toes turned slightly out.",
      "Shift your weight to one side, bending that knee and sinking into a deep squat.",
      "Keep the trailing leg straight with the heel down and toes up.",
      "Sink as low as your mobility allows, keeping the chest tall.",
      "Drive through the bent leg back to center, then repeat to the other side."
    ]
  },
  "cow-face-pose": {
    "description": "A seated pose with the knees stacked and the arms clasped behind the back, stretching the outer hips on one side and the shoulders in opposite directions.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "gluteus_medius"
    ],
    "secondary": [
      "posterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Sit on the floor and cross one knee directly over the other so the knees stack in the midline.",
      "Walk the feet out towards the hips and settle both sit bones evenly on the floor.",
      "Reach the arm on the top-knee side up and bend it behind the head, then reach the other arm up the back to clasp.",
      "Hold the position for the prescribed time, keeping the chest open and the spine tall.",
      "Release and repeat with the other leg and arm on top."
    ]
  },
  "crab-dips": {
    "description": "A floor triceps exercise from the reverse tabletop position: with the hands behind the hips and the trunk lifted, the elbows bend and straighten to move the body up and down.",
    "equipment": "bodyweight",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "gluteus_maximus",
      "pectoralis_major"
    ],
    "instructions": [
      "Sit with the knees bent, the feet flat and the hands on the floor behind you, fingers pointing towards the heels.",
      "Press into the hands and feet and lift the hips until the trunk is roughly level with the knees.",
      "Bend the elbows straight back to lower the hips towards the floor without sitting down.",
      "Push back up until the arms are straight, keeping the hips lifted.",
      "Repeat for the desired number of repetitions and lower the hips to finish."
    ]
  },
  "crescent-lunge": {
    "description": "A split-stance hold with the back heel lifted and the arms overhead, loading the front leg while the back hip stays long.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "hip_flexors"
    ],
    "instructions": [
      "Step one foot forward into a long stance with the back heel lifted and the toes pointing forward.",
      "Bend the front knee to about ninety degrees so it stacks over the ankle.",
      "Draw the back hip forward so both hip points face the front of the mat, then raise the arms overhead.",
      "Hold the position for the prescribed time with the ribs down and the back leg straight.",
      "Step the feet together and repeat on the other side."
    ]
  },
  "cross-body-crunch": {
    "description": "A floor oblique crunch that draws the opposite elbow and knee toward each other, hitting the obliques and rectus together.",
    "equipment": "bodyweight",
    "primary": [
      "obliques"
    ],
    "secondary": [
      "rectus_abdominis"
    ],
    "instructions": [
      "Lie face-up on the floor with knees bent and hands lightly behind the ears.",
      "Crunch up and rotate, bringing the right elbow toward the left knee as the knee draws up.",
      "Return to the starting position under control.",
      "Repeat on the other side, alternating every rep."
    ]
  },
  "cross-body-hammer-curl": {
    "description": "A neutral-grip curl bringing the dumbbell across the body toward the opposite shoulder, emphasizing the brachialis and forearms.",
    "equipment": "dumbbell",
    "primary": [
      "brachialis",
      "brachioradialis"
    ],
    "secondary": [
      "biceps_brachii",
      "forearm_flexors"
    ],
    "instructions": [
      "Stand tall holding a dumbbell in each hand with a neutral grip.",
      "Curl one dumbbell up across your body toward the opposite shoulder.",
      "Keep your elbow stationary at your side.",
      "Lower under control and repeat on the other side.",
      "Continue alternating for the desired number of reps."
    ]
  },
  "cross-body-shoulder-stretch": {
    "description": "A standing stretch that targets the rear shoulder by drawing one arm horizontally across the chest.",
    "equipment": "bodyweight",
    "primary": [
      "posterior_deltoid"
    ],
    "secondary": [
      "rhomboids"
    ],
    "instructions": [
      "Stand tall and bring one straight arm across your chest.",
      "Hook your other forearm under it.",
      "Gently pull the arm closer to your chest.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "crow-pose": {
    "description": "An arm balance with the knees resting on the backs of the upper arms and the feet lifted, held by the shoulders, arms and trunk.",
    "equipment": "bodyweight",
    "primary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "secondary": [
      "rectus_abdominis",
      "serratus_anterior"
    ],
    "instructions": [
      "Squat with the feet close together and place the palms shoulder-width apart on the floor in front of you.",
      "Bend the elbows straight back and set the knees high onto the backs of the upper arms.",
      "Shift the weight forward onto the hands until the feet float off the floor.",
      "Hold the balance for the prescribed time, rounding the upper back and looking slightly forward.",
      "Lower the feet under control."
    ]
  },
  "crunches": {
    "description": "A basic abdominal exercise focusing on the rectus abdominis.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques"
    ],
    "instructions": [
      "Lie on your back with knees bent and hands behind your head.",
      "Curl your upper body toward your knees, lifting your shoulder blades off the floor.",
      "Squeeze your abs at the top.",
      "Lower with control.",
      "Repeat."
    ]
  },
  "dancer-pose": {
    "description": "A standing balance on one leg where the free foot is held behind the body and pressed away, combining a backbend with a single-leg hold.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "hip_flexors"
    ],
    "instructions": [
      "Stand tall and shift the weight onto one foot, keeping that knee soft.",
      "Bend the other knee and take hold of the inside of that ankle behind you.",
      "Press the lifted foot back into the hand and reach the opposite arm forward as the chest lifts.",
      "Hold the shape for the prescribed time with the standing hip level and the gaze steady.",
      "Release the foot and repeat on the other side."
    ]
  },
  "db-bench-press": {
    "description": "A compound chest exercise using dumbbells, allowing a greater range of motion than the barbell bench press.",
    "equipment": "dumbbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on a flat bench holding a dumbbell in each hand at chest level.",
      "Press the dumbbells up until your arms are fully extended.",
      "Lower them slowly back to the start.",
      "Repeat."
    ]
  },
  "db-fly": {
    "description": "An isolation exercise that stretches and contracts the pectorals through a wide arc of motion.",
    "equipment": "dumbbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Lie flat on a bench with dumbbells held above your chest, palms facing each other.",
      "With a slight bend in the elbows, lower the dumbbells out to the sides.",
      "Return to the start by squeezing your chest.",
      "Repeat."
    ]
  },
  "db-kickstand-deadlift": {
    "description": "A staggered-stance hip hinge with one dumbbell that loads the front leg while the back foot provides light balance support.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "adductors",
      "erector_spinae"
    ],
    "instructions": [
      "Stand tall and step one foot back so only the toes lightly touch the floor.",
      "Hold a dumbbell in one hand at hip height.",
      "Hinge at the hips, lowering the dumbbell toward mid-shin while keeping the back flat.",
      "Keep most of your weight on the front foot throughout.",
      "Drive through the front heel to return to standing. Complete all reps, then switch sides."
    ]
  },
  "db-lunge": {
    "description": "A unilateral lower-body exercise with dumbbells targeting quads and glutes through a stepping motion.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Stand holding dumbbells at your sides.",
      "Step forward with one foot and lower your back knee toward the floor.",
      "Push off the front foot to return.",
      "Alternate legs.",
      "Repeat."
    ]
  },
  "db-overhead-carry": {
    "description": "A loaded walk with a single dumbbell locked out overhead, demanding shoulder stability and an upright trunk over every step.",
    "equipment": "dumbbell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "obliques",
      "quadratus_lumborum",
      "serratus_anterior",
      "transverse_abdominis",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Clean or press a dumbbell to a locked-out position directly above your shoulder.",
      "Push the arm all the way up so the elbow is straight and the biceps is close to your ear.",
      "Brace your ribs down rather than letting your lower back arch to hold the weight up.",
      "Walk forward with controlled strides, keeping the dumbbell stacked over your shoulder and hip.",
      "Keep your eyes forward — tipping your head back to watch the weight drags your posture with it.",
      "Carry for the desired distance, lower under control, then repeat with the other arm."
    ]
  },
  "db-pullover": {
    "description": "A compound movement targeting the lats and chest with a stretching motion.",
    "equipment": "dumbbell",
    "primary": [
      "latissimus_dorsi",
      "pectoralis_major"
    ],
    "secondary": [
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on a flat bench with a dumbbell held above your chest, arms extended.",
      "Lower the dumbbell behind your head in an arc, keeping slight bend in elbows.",
      "Stretch until you feel tension in your lats and chest.",
      "Pull the dumbbell back to the starting position.",
      "Repeat."
    ]
  },
  "db-reverse-curl": {
    "description": "A curl variation with a pronated grip targeting the brachialis and forearm extensors.",
    "equipment": "dumbbell",
    "primary": [
      "brachialis",
      "forearm_extensors"
    ],
    "secondary": [
      "biceps_brachii"
    ],
    "instructions": [
      "Hold dumbbells with an overhand grip at your sides.",
      "Curl them up to shoulder height.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "db-reverse-wrist-curl": {
    "description": "A dumbbell wrist curl with palms down, training the forearm extensors.",
    "equipment": "dumbbell",
    "primary": [
      "forearm_extensors"
    ],
    "secondary": [],
    "instructions": [
      "Sit on a bench holding a dumbbell in each hand, forearms resting on your thighs, palms down.",
      "Let both wrists drop, lowering the dumbbells toward the floor.",
      "Lift the backs of your hands toward the ceiling by extending your wrists.",
      "Squeeze at the top, then lower under control.",
      "Repeat for the desired number of reps."
    ]
  },
  "db-shrug": {
    "description": "A dumbbell shrug targeting the upper trapezius for neck and upper back thickness.",
    "equipment": "dumbbell",
    "primary": [
      "trapezius"
    ],
    "secondary": [
      "rhomboids"
    ],
    "instructions": [
      "Stand holding dumbbells at your sides.",
      "Shrug your shoulders straight up as high as possible.",
      "Hold briefly, then lower.",
      "Repeat."
    ]
  },
  "db-skull-crusher": {
    "description": "A lying triceps extension with dumbbells allowing independent arm movement.",
    "equipment": "dumbbell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Lie on a flat bench holding dumbbells over your chest.",
      "Lower the dumbbells toward the sides of your head.",
      "Extend your arms back up.",
      "Repeat."
    ]
  },
  "db-somersault-squat": {
    "description": "A single-arm reaching squat with a dumbbell that adds rotation and shoulder mobility to a squat pattern.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings",
      "obliques"
    ],
    "instructions": [
      "Stand with feet shoulder-width holding a dumbbell in one hand at the shoulder.",
      "Squat down while reaching the dumbbell forward and across the body.",
      "Reach the bottom of the squat with the dumbbell extended past the opposite knee.",
      "Drive through the heels to stand up, returning the dumbbell to the shoulder.",
      "Complete reps per side, then switch."
    ]
  },
  "db-squat": {
    "description": "A back squat pattern loaded with a dumbbell in each hand, accessible without a barbell.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Stand with feet shoulder-width, a dumbbell in each hand at the sides.",
      "Brace the core and keep the chest up.",
      "Squat down by hinging at the hips and bending the knees.",
      "Descend until the thighs are parallel or below.",
      "Drive through the heels to stand back up."
    ]
  },
  "db-sumo-squat": {
    "description": "A wide-stance squat with dumbbells held at the sides, biasing the inner thighs and glutes.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "adductors",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand with feet wider than shoulder-width, toes turned out about 30 degrees.",
      "Hold a dumbbell in each hand at your sides.",
      "Brace the core and keep the chest up.",
      "Bend at the hips and knees to sit straight down into a deep squat.",
      "Drive through the heels to return to standing.",
      "Repeat for the desired number of reps."
    ]
  },
  "db-svend-press": {
    "description": "A standing chest exercise pressing two dumbbells together in front of the body, isolating the inner chest.",
    "equipment": "dumbbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand and press two dumbbells together horizontally at chest height.",
      "Maintain the inward squeeze on the dumbbells throughout.",
      "Press the dumbbells forward to full arm extension.",
      "Pull them back to the chest under control.",
      "Repeat for the prescribed reps."
    ]
  },
  "dead-bug": {
    "description": "A supine core exercise coordinating opposite limb extension to train deep core stability.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis",
      "transverse_abdominis"
    ],
    "secondary": [
      "hip_flexors"
    ],
    "instructions": [
      "Lie on your back with arms extended toward the ceiling and knees at 90 degrees.",
      "Lower your right arm and left leg toward the floor while keeping the lower back pressed down.",
      "Return to start.",
      "Repeat on the other side.",
      "Alternate."
    ]
  },
  "dead-bug-hold": {
    "description": "The extended position of the dead bug held for time: lying on the back with one arm overhead and the opposite leg straightened just above the floor, keeping the lower back flat against the ground.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis",
      "transverse_abdominis"
    ],
    "secondary": [
      "hip_flexors"
    ],
    "instructions": [
      "Lie on your back with the arms pointing at the ceiling and the hips and knees bent to 90 degrees.",
      "Press the lower back into the floor and keep it there for the whole set.",
      "Extend one arm overhead and straighten the opposite leg until both hover just above the floor.",
      "Hold that extended position for the prescribed time without letting the ribs flare or the back arch.",
      "Return to the start and repeat with the other arm and leg."
    ]
  },
  "dead-hang": {
    "description": "A static hang from a pull-up bar with arms fully extended, primarily challenging grip and forearm strength.",
    "equipment": "pull up bar",
    "primary": [
      "forearm_flexors"
    ],
    "secondary": [
      "latissimus_dorsi",
      "rectus_abdominis",
      "trapezius"
    ],
    "instructions": [
      "Grip a pull-up bar with palms facing away, shoulder-width apart.",
      "Hang with your arms fully extended and feet off the ground.",
      "Relax your shoulders and let your body hang.",
      "Keep your core lightly engaged.",
      "Hold for the desired duration."
    ]
  },
  "deadlift": {
    "description": "A full-body compound lift that primarily targets the posterior chain.",
    "equipment": "barbell",
    "primary": [
      "erector_spinae",
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "quadriceps",
      "trapezius"
    ],
    "instructions": [
      "Stand with feet hip-width apart, bar over mid-foot.",
      "Hinge at the hips and grip the bar.",
      "Brace your core and lift by extending hips and knees.",
      "Stand tall at the top, then lower under control.",
      "Repeat."
    ]
  },
  "decline-bench-press": {
    "description": "A compound chest press on a decline bench targeting the lower pectorals.",
    "equipment": "dumbbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Set the bench to a decline angle. Lie down and secure your feet.",
      "Unrack the barbell and lower it to your lower chest.",
      "Press back up to the start.",
      "Repeat."
    ]
  },
  "decline-bench-press-barbell": {
    "description": "A barbell compound press on a decline bench emphasizing the lower chest.",
    "equipment": "barbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Set the bench to a decline angle. Lie down and secure your feet.",
      "Grip the bar slightly wider than shoulder-width.",
      "Lower the bar to your lower chest, then press back up.",
      "Repeat."
    ]
  },
  "decline-bench-press-ez-bar": {
    "description": "A decline press using an EZ-bar for a wrist-friendly grip targeting the lower chest.",
    "equipment": "ez bar",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Set the bench to a decline. Secure your feet and grip the EZ-bar.",
      "Lower the bar to your lower chest.",
      "Press back up explosively.",
      "Repeat."
    ]
  },
  "decline-crunch": {
    "description": "A crunch performed on a decline bench, increasing the range of motion and resistance on the abs.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "hip_flexors",
      "obliques"
    ],
    "instructions": [
      "Secure your feet at the top of a decline bench.",
      "Lie back with hands crossed on your chest or behind your head.",
      "Crunch up by flexing your spine toward your knees.",
      "Squeeze your abs at the top.",
      "Lower under control and repeat."
    ]
  },
  "decline-db-fly": {
    "description": "An isolation fly movement performed on a decline bench to emphasize the lower chest.",
    "equipment": "dumbbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Lie on a decline bench holding dumbbells above your chest.",
      "With a slight elbow bend, lower the dumbbells wide to each side.",
      "Squeeze the chest to bring them back up.",
      "Repeat."
    ]
  },
  "decline-push-up": {
    "description": "A bodyweight push-up with feet elevated to increase upper chest and shoulder activation.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Place your feet on an elevated surface and hands on the ground.",
      "Lower your chest to the floor in a controlled manner.",
      "Push back up to the start.",
      "Repeat."
    ]
  },
  "deficit-deadlift": {
    "description": "A deadlift performed standing on a low platform, extending the range of motion to build strength off the floor.",
    "equipment": "barbell",
    "primary": [
      "erector_spinae",
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "latissimus_dorsi",
      "quadriceps",
      "trapezius"
    ],
    "instructions": [
      "Stand on a small platform with a loaded barbell over your midfoot.",
      "Hinge down and grip the bar just outside your knees.",
      "Drive through your legs to stand up while keeping the bar close.",
      "Lock out your hips and knees at the top.",
      "Lower under control and repeat."
    ]
  },
  "deficit-push-ups": {
    "description": "A push-up variation with hands on raised supports, lowering the chest below hand level for a greater range of motion.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Place your hands on two elevated surfaces like parallettes or blocks.",
      "Assume a plank position with hands under your shoulders.",
      "Lower your chest below the level of your hands.",
      "Press back up to extend your arms.",
      "Repeat for the desired number of reps."
    ]
  },
  "diamond-push-ups": {
    "description": "A close-hand push-up with thumbs and index fingers forming a diamond, shifting the emphasis onto the triceps.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major",
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "serratus_anterior"
    ],
    "instructions": [
      "Assume a push-up position with hands close together forming a diamond.",
      "Keep your elbows tucked close to your sides.",
      "Lower your chest toward your hands.",
      "Press back up to extend your arms.",
      "Repeat for the desired number of reps."
    ]
  },
  "dips": {
    "description": "A compound bodyweight exercise targeting the lower chest and triceps.",
    "equipment": "dip station",
    "primary": [
      "pectoralis_major",
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Grip parallel dip bars and lift yourself to the top position with arms locked.",
      "Lean your torso forward slightly.",
      "Lower your body by bending your elbows until shoulders are below elbows.",
      "Press back up to the starting position.",
      "Repeat."
    ]
  },
  "dolphin-pose": {
    "description": "An inverted V held on the forearms: the hips lift towards the ceiling while the shoulders take the load, which makes it the standard preparation for forearm inversions.",
    "equipment": "bodyweight",
    "primary": [
      "anterior_deltoid",
      "trapezius"
    ],
    "secondary": [
      "hamstrings",
      "serratus_anterior"
    ],
    "instructions": [
      "Kneel and place the forearms on the floor shoulder-width apart with the elbows under the shoulders.",
      "Tuck the toes and lift the hips up and back until the body forms an inverted V.",
      "Press the forearms down and draw the shoulders away from the ears; let the heels stay high.",
      "Hold the position for the prescribed time, keeping the neck relaxed between the arms.",
      "Lower the knees to the floor to come out."
    ]
  },
  "donkey-calf-raise": {
    "description": "A bent-over calf raise that maximizes calf stretch by hinging at the hips.",
    "equipment": "bodyweight",
    "primary": [
      "gastrocnemius"
    ],
    "secondary": [
      "soleus"
    ],
    "instructions": [
      "Bend at the hips and rest the forearms on a bench or sturdy support.",
      "Place the balls of the feet on a raised platform with heels free.",
      "Drop the heels below platform level for a full stretch.",
      "Drive up onto the toes as high as possible, squeezing the calves.",
      "Lower under control to a deep stretch."
    ]
  },
  "doorway-chest-stretch": {
    "description": "An open-arm stretch that lengthens the chest and front shoulders by drawing the arms back.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Stand tall and raise your arms into a goalpost position.",
      "Bend your elbows ninety degrees, forearms vertical.",
      "Draw your elbows back and squeeze your shoulder blades.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "double-db-kickstand-deadlift": {
    "description": "A staggered-stance hip hinge with two dumbbells that distributes load primarily through the front leg while the back foot lightly grounds for balance.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "adductors",
      "erector_spinae"
    ],
    "instructions": [
      "Stand tall and step one foot back so only the toes touch the floor.",
      "Hold a dumbbell in each hand at hip height.",
      "Hinge at the hips, lowering both dumbbells toward mid-shin while keeping the back flat.",
      "Keep most of your weight on the front foot throughout.",
      "Drive through the front heel to return to standing. Switch sides after all reps."
    ]
  },
  "double-db-overhead-carry": {
    "description": "A loaded walk with a dumbbell locked out above each shoulder, doubling the overhead load and removing the free arm that would otherwise help you balance.",
    "equipment": "dumbbell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "erector_spinae",
      "serratus_anterior",
      "transverse_abdominis",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Clean or press a dumbbell to lockout above each shoulder.",
      "Straighten both elbows fully and pull your shoulder blades up into the weights rather than shrugging away from them.",
      "Brace hard and keep your ribs down — with both arms overhead the temptation to arch is much stronger.",
      "Walk forward with short, deliberate strides, keeping both dumbbells stacked over your shoulders.",
      "Keep breathing shallowly and steadily instead of holding your breath for the whole carry.",
      "Carry for the desired distance, then lower both weights under control."
    ]
  },
  "double-kettlebell-bicep-curl": {
    "description": "A standing biceps curl with one kettlebell in each hand, held by the handle. The offset mass at the bottom of the bell adds a mild grip and stability challenge.",
    "equipment": "kettlebell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis",
      "forearm_flexors"
    ],
    "instructions": [
      "Stand holding a kettlebell in each hand by the handle, palms facing forward.",
      "Keep the elbows tucked to the sides and the bells hanging at arm length.",
      "Curl both kettlebells up toward the shoulders by flexing the elbows.",
      "Squeeze the biceps at the top, then lower under control to the starting position.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "double-kettlebell-clean": {
    "description": "An explosive hip hinge that racks two kettlebells to the shoulders simultaneously, the foundation for double-KB pressing and jerking.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "anterior_deltoid",
      "erector_spinae",
      "forearm_flexors",
      "trapezius"
    ],
    "instructions": [
      "Stand with two kettlebells on the floor between your feet, handles angled slightly inward.",
      "Hinge at the hips, grip the handles, and hike the kettlebells back between the legs.",
      "Explosively extend the hips to drive the kettlebells up along the body.",
      "As they reach chest height, spear your hands through the handles to catch them at the rack position on the shoulders.",
      "Lower back to the hang by hinging at the hips and guiding the bells between the legs.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "double-kettlebell-clean-and-press": {
    "description": "A full-body power exercise that cleans two kettlebells from the floor to the racked position at the shoulders and then presses both overhead to lockout in one continuous sequence.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "gluteus_maximus",
      "quadriceps",
      "rectus_abdominis",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand with two kettlebells on the floor between your feet, feet about hip-width apart, and hinge at the hips to grip one handle in each hand.",
      "Drive through your legs and extend your hips explosively to pull both kettlebells up, then rotate your elbows under and catch the bells in the racked position at the front of your shoulders.",
      "Brace your core and press both kettlebells overhead until your arms are fully locked out.",
      "Lower the kettlebells back to the racked position, then down to the floor under control.",
      "Repeat for the desired number of reps."
    ]
  },
  "double-kettlebell-dead-clean": {
    "description": "An explosive kettlebell movement cleaning two bells from the floor to the rack position, with each rep starting from a dead stop.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "forearm_flexors",
      "quadriceps",
      "trapezius"
    ],
    "instructions": [
      "Set two kettlebells on the floor between your feet.",
      "Hinge down and grip both handles.",
      "Drive explosively through your legs and hips.",
      "Pull the kettlebells up and rotate them to the rack position.",
      "Lower them back to the floor and repeat."
    ]
  },
  "double-kettlebell-dead-split-snatch": {
    "description": "An Olympic-style kettlebell lift snatching two bells from the floor to overhead, caught in a split stance.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid",
      "gluteus_maximus"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings",
      "quadriceps",
      "trapezius"
    ],
    "instructions": [
      "Set two kettlebells on the floor between your feet.",
      "Hinge down and grip both handles firmly.",
      "Explosively pull the kettlebells overhead in one motion.",
      "Drop into a split stance to catch them at lockout.",
      "Recover by stepping feet back together."
    ]
  },
  "double-kettlebell-jerk": {
    "description": "An overhead lift using a double dip-drive to launch two kettlebells from the rack to lockout, the hallmark lift of kettlebell sport.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_maximus",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Start with two kettlebells racked on the shoulders, elbows resting on the hips.",
      "Perform a short dip at the knees, then explosively extend the legs to drive the kettlebells up.",
      "As the bells rise, perform a second dip under them by bending the knees again.",
      "Catch the kettlebells overhead with arms locked out, then stand fully upright.",
      "Lower them back to the rack under control and repeat."
    ]
  },
  "double-kettlebell-overhead-carry": {
    "description": "A loaded walk with a kettlebell locked out above each shoulder — the hardest of the carries to keep still, combining the offset mass of the bells with double the overhead load.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "erector_spinae",
      "forearm_extensors",
      "serratus_anterior",
      "transverse_abdominis",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Clean two kettlebells to the rack, then press or push press both to lockout overhead.",
      "Straighten both elbows and settle each bell behind and above its wrist, with your wrists straight.",
      "Pull your ribs down and brace hard before the first step; with both bells overhead there is nothing to counterbalance with.",
      "Walk forward with short, controlled strides, keeping both bells stacked over your shoulders.",
      "Keep looking straight ahead and breathe steadily through the carry.",
      "Cover the desired distance, then lower both bells to the rack and down under control."
    ]
  },
  "double-kettlebell-overhead-press": {
    "description": "A strict overhead press with two kettlebells from the rack position, demanding shoulder strength and a braced core.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "secondary": [
      "rectus_abdominis",
      "serratus_anterior",
      "trapezius"
    ],
    "instructions": [
      "Clean two kettlebells to the rack position at your shoulders.",
      "Stand tall with feet hip-width apart.",
      "Press both kettlebells straight overhead.",
      "Lock out your arms at the top.",
      "Lower back to the rack position and repeat."
    ]
  },
  "double-kettlebell-push-press": {
    "description": "A push press with two kettlebells in the rack. The leg drive (single dip) lets you launch heavier loads overhead than a strict press — the middle tier between strict OHP and full jerk.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid"
    ],
    "secondary": [
      "gluteus_maximus",
      "lateral_deltoid",
      "quadriceps",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand with two kettlebells racked at the shoulders, elbows down and tucked.",
      "Feet shoulder-width, core braced.",
      "Dip the knees slightly while keeping the torso vertical.",
      "Explosively extend the legs and press both bells overhead in one motion.",
      "Lock out with the bells over the mid-foot.",
      "Lower back to the rack under control.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "double-kettlebell-rear-delt-row": {
    "description": "A bent-over row with a kettlebell in each hand and the elbows driven out wide of the torso, which shifts the work off the lats and onto the posterior deltoids and upper back.",
    "equipment": "kettlebell",
    "primary": [
      "posterior_deltoid",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "erector_spinae",
      "latissimus_dorsi",
      "trapezius"
    ],
    "instructions": [
      "Stand a kettlebell just outside each foot with your feet about hip-width apart.",
      "Hinge at the hips with a flat back until your torso is close to parallel with the floor, letting your knees bend slightly.",
      "Take both handles with an overhand grip and let your arms hang straight down from your shoulders.",
      "Row both bells up by driving your elbows out to the sides, away from your ribs rather than back along them.",
      "Stop when your upper arms are roughly in line with your shoulders, and squeeze your shoulder blades together.",
      "Lower the bells under control until your arms hang straight again, and repeat for the desired reps."
    ]
  },
  "double-kettlebell-row": {
    "description": "A bent-over rowing exercise pulling two kettlebells to the hips, strengthening the lats and upper back.",
    "equipment": "kettlebell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "erector_spinae",
      "trapezius"
    ],
    "instructions": [
      "Hold a kettlebell in each hand and hinge forward at the hips.",
      "Let your arms hang straight down from your shoulders.",
      "Row both kettlebells to your hips by driving elbows back.",
      "Squeeze your shoulder blades at the top.",
      "Lower under control and repeat."
    ]
  },
  "double-kettlebell-split-jerk": {
    "description": "An explosive overhead lift driving two kettlebells from the rack to lockout, caught in a split stance.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_maximus",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Clean two kettlebells to the rack position at your shoulders.",
      "Dip slightly by bending your knees.",
      "Drive the kettlebells overhead explosively.",
      "Split your legs to catch them with locked arms.",
      "Recover by stepping feet back together."
    ]
  },
  "double-kettlebell-swing-snatch": {
    "description": "A ballistic kettlebell exercise swinging two bells from between the legs to an overhead lockout in one motion.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "anterior_deltoid",
      "erector_spinae",
      "forearm_flexors",
      "trapezius"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart holding two kettlebells.",
      "Hinge at the hips to swing the bells between your legs.",
      "Explosively drive your hips forward to swing the bells up.",
      "Punch through to catch both kettlebells overhead with locked arms.",
      "Lower under control and repeat."
    ]
  },
  "downward-dog": {
    "description": "An inverted-V stretch that lengthens the hamstrings, calves, shoulders and back at once.",
    "equipment": "bodyweight",
    "primary": [
      "gastrocnemius",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_maximus",
      "latissimus_dorsi"
    ],
    "instructions": [
      "Start on all fours with hands slightly ahead of your shoulders.",
      "Tuck your toes and lift your hips up and back.",
      "Straighten your legs and press your heels toward the floor.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "downward-dog-knee-tuck": {
    "description": "A moving core drill held in downward dog: the hips stay high while one knee is drawn in under the chest and sent back to the start, alternating sides. The shoulders support the whole set, so the trunk works without the low-hip position of a plank.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "anterior_deltoid",
      "serratus_anterior",
      "transverse_abdominis"
    ],
    "instructions": [
      "Set up in downward dog with the hands shoulder-width apart and the hips high.",
      "Press the floor away and brace the trunk so the lower back stays long.",
      "Draw one knee in towards the chest, rounding the upper back slightly as it comes in.",
      "Extend the leg back to the starting position under control.",
      "Repeat with the other leg and keep alternating for the desired number of repetitions."
    ]
  },
  "downward-dog-pedal": {
    "description": "A warm-up performed in downward dog: the knees bend one at a time so each heel presses towards the floor in turn, taking the calf and the back of the ankle through a moving stretch instead of a static hold.",
    "equipment": "bodyweight",
    "primary": [
      "gastrocnemius",
      "soleus"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Set up in downward dog with the hands shoulder-width apart and the hips high.",
      "Bend one knee and let that heel lift while the opposite heel presses down towards the floor.",
      "Switch sides smoothly, as if pedalling, keeping the hips high throughout.",
      "Keep the hands pressing evenly so the shoulders stay stable.",
      "Continue alternating for the desired number of repetitions or time."
    ]
  },
  "downward-dog-to-knee-drive": {
    "description": "From three-legged dog the lifted leg folds forward so the knee travels towards the elbow or the nose, then extends back up. The shoulders hold the position while the trunk does the folding, one side at a time.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "anterior_deltoid",
      "gluteus_maximus",
      "serratus_anterior"
    ],
    "instructions": [
      "Set up in downward dog and lift one leg behind you into three-legged dog.",
      "Press both hands down and shift the weight slightly forward.",
      "Round the upper back and drive that knee forward towards the elbow or the nose.",
      "Extend the leg back up to three-legged dog under control.",
      "Finish the repetitions on that side and repeat on the other."
    ]
  },
  "downward-dog-to-low-lunge": {
    "description": "The standard step-through: from downward dog one foot travels forward between the hands into a low lunge, then returns. It opens the hip flexor of the trailing leg and rehearses the transition used throughout flow practice.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors"
    ],
    "secondary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "instructions": [
      "Start in downward dog with the hands shoulder-width apart.",
      "Shift the weight forward and step one foot up between the hands.",
      "Lower the back knee to the floor and sink the hips into a low lunge.",
      "Press back through the hands, lift the back knee and step the front foot back to downward dog.",
      "Repeat on the other side and keep alternating."
    ]
  },
  "downward-dog-to-plank": {
    "description": "A moving transition between downward dog and a high plank: the hips travel from high to level and back, so the shoulders and trunk work through a full range instead of holding one position.",
    "equipment": "bodyweight",
    "primary": [
      "anterior_deltoid",
      "rectus_abdominis"
    ],
    "secondary": [
      "hamstrings",
      "serratus_anterior",
      "trapezius"
    ],
    "instructions": [
      "Set up in downward dog with the hips high and the hands shoulder-width apart.",
      "Shift the weight forward and lower the hips until the body forms a straight line in a high plank.",
      "Hold the plank for a moment with the ribs down and the glutes engaged.",
      "Press the floor away and lift the hips back up into downward dog.",
      "Continue alternating for the desired number of repetitions."
    ]
  },
  "downward-dog-to-upward-dog": {
    "description": "The vinyasa transition: the body travels from downward dog forward into upward dog and back, alternating between a shoulder-loaded inverted V and an open-chested backbend.",
    "equipment": "bodyweight",
    "primary": [
      "anterior_deltoid",
      "erector_spinae"
    ],
    "secondary": [
      "pectoralis_major",
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Start in downward dog with the hips high and the hands shoulder-width apart.",
      "Shift forward through plank and lower slightly, then press the chest through into upward dog with the thighs off the floor.",
      "Draw the shoulders back and down and keep the neck long.",
      "Tuck the toes, press the floor away and lift the hips back into downward dog.",
      "Continue moving between the two positions for the desired number of repetitions."
    ]
  },
  "drag-curl": {
    "description": "A barbell curl where the elbows travel backward and the bar drags up the torso, eliminating front-delt assistance and emphasizing the long head of the biceps.",
    "equipment": "barbell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis"
    ],
    "instructions": [
      "Stand holding a barbell with an underhand grip, hands shoulder-width apart.",
      "Start with the bar at the thighs and elbows at the sides.",
      "Curl the bar by sliding (dragging) it straight up along your body.",
      "As the bar rises, let the elbows travel backward so the bar stays in contact with your torso.",
      "Stop when the bar reaches mid-chest; the biceps will be fully shortened.",
      "Lower under control along the same path and repeat."
    ]
  },
  "dragon-flag": {
    "description": "A demanding core hold performed on a bench: gripping behind your head, you raise your entire body into a rigid straight line supported only by your upper back.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "erector_spinae",
      "hip_flexors",
      "obliques",
      "transverse_abdominis"
    ],
    "instructions": [
      "Lie on a bench and grip it firmly behind your head.",
      "Raise your body up so only your upper back stays on the bench.",
      "Keep your body rigid in a straight line.",
      "Lower your body under control until nearly horizontal.",
      "Raise back up and repeat."
    ]
  },
  "dumbbell-bench-pull": {
    "description": "A prone rowing movement on a bench for strict upper back work.",
    "equipment": "dumbbell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid"
    ],
    "instructions": [
      "Lie face down on an incline bench holding dumbbells.",
      "Let your arms hang straight down.",
      "Pull the dumbbells up toward your chest, squeezing your shoulder blades.",
      "Lower with control.",
      "Repeat."
    ]
  },
  "dumbbell-calf-raise": {
    "description": "A weighted calf raise holding dumbbells at the sides, performed on an elevated edge for a full stretch.",
    "equipment": "dumbbell",
    "primary": [
      "gastrocnemius",
      "soleus"
    ],
    "secondary": [
      "forearm_flexors"
    ],
    "instructions": [
      "Stand holding a dumbbell in each hand at your sides.",
      "Place the balls of your feet on a raised surface with heels hanging off.",
      "Press through the balls of your feet to raise your heels as high as possible.",
      "Squeeze your calves at the top of the movement.",
      "Lower your heels below the platform to stretch the calves.",
      "Repeat for the desired number of reps."
    ]
  },
  "dumbbell-deadlift": {
    "description": "A deadlift variation using dumbbells held in front of the thighs, training the glutes, hamstrings, and lower back.",
    "equipment": "dumbbell",
    "primary": [
      "erector_spinae",
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "latissimus_dorsi",
      "quadriceps",
      "trapezius"
    ],
    "instructions": [
      "Stand with dumbbells in front of your thighs, feet hip-width apart.",
      "Hinge at the hips and lower the dumbbells along your legs with a flat back.",
      "Keep the dumbbells close to your shins throughout the descent.",
      "Drive through your heels to return to standing.",
      "Extend your hips fully at the top without hyperextending your lower back.",
      "Repeat for the desired number of reps."
    ]
  },
  "dumbbell-face-pull": {
    "description": "A rear-delt and upper-back exercise performed by pulling dumbbells toward the face with a wide elbow path.",
    "equipment": "dumbbell",
    "primary": [
      "posterior_deltoid",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "trapezius"
    ],
    "instructions": [
      "Stand or sit holding a dumbbell in each hand with arms extended forward.",
      "Bend your elbows and pull the dumbbells toward your face.",
      "Flare your elbows out wide to shoulder height.",
      "Squeeze your rear delts and upper back at the peak.",
      "Lower the dumbbells back under control.",
      "Repeat for the desired number of reps."
    ]
  },
  "dumbbell-farmers-walk": {
    "description": "This full-body exercise involves walking while holding heavy dumbbells, effectively building grip strength, core stability, and overall muscular endurance.",
    "equipment": "dumbbell",
    "primary": [
      "forearm_flexors",
      "trapezius"
    ],
    "secondary": [
      "gluteus_maximus",
      "obliques",
      "quadriceps",
      "rectus_abdominis"
    ],
    "instructions": [
      "Stand tall with a dumbbell in each hand, arms extended at your sides.",
      "Retract your shoulder blades and brace your core, maintaining a neutral spine.",
      "Walk slowly and deliberately for a set distance or duration, taking short, controlled steps.",
      "Keep your chest up and avoid leaning to one side as you walk.",
      "Focus on maintaining a strong, stable posture throughout the movement."
    ]
  },
  "dumbbell-floor-press": {
    "description": "A dumbbell press performed lying on the floor, restricting the range of motion for joint-friendly pressing.",
    "equipment": "dumbbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on the floor with a dumbbell in each hand at chest level.",
      "Press the dumbbells upward until arms are extended.",
      "Lower under control until elbows touch the floor.",
      "Repeat."
    ]
  },
  "dumbbell-front-raise": {
    "description": "An isolation exercise targeting the anterior deltoid through a forward raise motion.",
    "equipment": "dumbbell",
    "primary": [
      "anterior_deltoid"
    ],
    "secondary": [
      "lateral_deltoid"
    ],
    "instructions": [
      "Stand with dumbbells at your sides, palms facing your thighs.",
      "Raise one or both dumbbells forward to shoulder height.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "dumbbell-front-squat": {
    "description": "A squat holding dumbbells racked at the shoulders, keeping the torso upright and emphasizing the quads.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings",
      "rectus_abdominis"
    ],
    "instructions": [
      "Hold a dumbbell in each hand resting on top of your shoulders.",
      "Keep your elbows high and torso upright.",
      "Lower your hips by bending knees until thighs are parallel to the floor.",
      "Drive through your heels to stand back up.",
      "Maintain a neutral spine throughout.",
      "Repeat for the desired number of reps."
    ]
  },
  "dumbbell-hip-thrust": {
    "description": "The Dumbbell Hip Thrust is a highly effective compound exercise for building strong glutes and hamstrings, performed by thrusting the hips upwards with a dumbbell across the pelvis.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings",
      "quadriceps"
    ],
    "instructions": [
      "Sit on the floor with your upper back against a bench, knees bent, feet flat, and a dumbbell across your hips.",
      "Brace your core and drive through your heels, lifting your hips off the floor until your body forms a straight line from shoulders to knees.",
      "Squeeze your glutes powerfully at the top of the movement, ensuring full hip extension.",
      "Slowly lower your hips back down to the starting position with control, maintaining tension.",
      "Repeat for the desired number of repetitions."
    ]
  },
  "dumbbell-pistol-squat": {
    "description": "The Dumbbell Pistol Squat is an advanced single-leg squat variation that builds significant lower body strength, balance, and mobility, primarily targeting the quadriceps and glutes.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand tall, holding a dumbbell in each hand with your arms hanging at your sides.",
      "Lift one leg straight out in front of you, keeping it extended throughout the movement.",
      "Lower your body by bending the knee of your standing leg, keeping your chest up and back straight.",
      "Descend until your glutes are close to your heel or your thigh is parallel to the floor, maintaining balance.",
      "Push through your heel to return to the starting position, extending your standing leg fully.",
      "Complete all reps on one side, then switch legs and repeat for the other side per set."
    ]
  },
  "dumbbell-push-press": {
    "description": "A compound overhead press that uses a leg drive to initiate momentum and develop shoulder and triceps power.",
    "equipment": "dumbbell",
    "primary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "secondary": [
      "gluteus_maximus",
      "lateral_deltoid",
      "quadriceps",
      "trapezius"
    ],
    "instructions": [
      "Stand holding dumbbells at shoulder height with palms facing forward.",
      "Slightly bend your knees into a quarter squat.",
      "Drive through your legs to generate momentum, then press the dumbbells overhead.",
      "Lock out your arms at the top.",
      "Lower the dumbbells back to shoulder height with control."
    ]
  },
  "dumbbell-reverse-fly": {
    "description": "A hinged isolation exercise raising dumbbells out to the sides, targeting the rear deltoids and upper back.",
    "equipment": "dumbbell",
    "primary": [
      "posterior_deltoid"
    ],
    "secondary": [
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Hinge forward at the hips holding dumbbells with arms hanging down.",
      "Keep your back flat and knees slightly bent.",
      "Raise the dumbbells out to the sides until level with your shoulders.",
      "Squeeze your shoulder blades together at the top.",
      "Lower the dumbbells back with control.",
      "Repeat for the desired number of reps."
    ]
  },
  "dumbbell-romanian-deadlift": {
    "description": "A hip-hinge movement with dumbbells and soft knees, loading the hamstrings and glutes through a controlled stretch.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "forearm_flexors"
    ],
    "instructions": [
      "Stand holding dumbbells in front of your thighs with a soft knee bend.",
      "Hinge at the hips and push your glutes back.",
      "Lower the dumbbells along your legs until you feel a hamstring stretch.",
      "Keep your back flat and shoulders pulled back.",
      "Drive your hips forward to return to standing.",
      "Repeat for the desired number of reps."
    ]
  },
  "dumbbell-shoulder-press": {
    "description": "An overhead press with dumbbells performed seated or standing, building the front and side delts.",
    "equipment": "dumbbell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Sit or stand holding dumbbells at shoulder height, palms facing forward.",
      "Press both dumbbells overhead until arms are fully extended.",
      "Keep your core braced and avoid arching your lower back.",
      "Lower the dumbbells under control back to shoulder height.",
      "Do not let the dumbbells drift behind your head.",
      "Repeat for the desired number of reps."
    ]
  },
  "dumbbell-side-bend": {
    "description": "A standing oblique isolation exercise using a dumbbell to develop lateral core strength and stability.",
    "equipment": "dumbbell",
    "primary": [
      "obliques"
    ],
    "secondary": [
      "erector_spinae",
      "quadratus_lumborum",
      "transverse_abdominis"
    ],
    "instructions": [
      "Stand upright holding a dumbbell in one hand at your side.",
      "Keep the opposite hand on your hip or behind your head.",
      "Bend laterally toward the dumbbell side, lowering it along your thigh.",
      "Return to upright, then bend to the opposite side using only your obliques.",
      "Complete all reps per side."
    ]
  },
  "dumbbell-snatch": {
    "description": "An explosive single-arm lift driving a dumbbell from the floor to overhead in one fluid motion.",
    "equipment": "dumbbell",
    "primary": [
      "anterior_deltoid",
      "gluteus_maximus",
      "trapezius"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings",
      "quadriceps"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart, dumbbell on the floor between your feet.",
      "Hinge and grip the dumbbell with one hand.",
      "Explosively extend hips, knees, and ankles to pull the dumbbell upward.",
      "Punch the dumbbell overhead in one fluid motion.",
      "Lock out your arm and stabilize at the top.",
      "Complete reps on one side, then switch."
    ]
  },
  "dumbbell-split-squat": {
    "description": "A split-stance squat holding dumbbells at the sides, training the quads and glutes one leg at a time.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand in a split stance holding dumbbells at your sides.",
      "Keep your torso upright and core braced.",
      "Lower your back knee toward the floor by bending both knees.",
      "Stop when your front thigh is parallel to the floor.",
      "Drive through your front heel to return to standing.",
      "Complete reps on one side, then switch."
    ]
  },
  "dumbbell-tricep-extension": {
    "description": "A single-arm overhead tricep extension for balanced arm development.",
    "equipment": "dumbbell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Stand holding a dumbbell in one hand overhead.",
      "Lower the dumbbell behind your head by bending your elbow.",
      "Extend your arm back to the starting position.",
      "Keep your elbow close to your head.",
      "Repeat on both sides."
    ]
  },
  "dumbbell-upright-row": {
    "description": "A compound pulling movement with dumbbells that targets the lateral deltoids and upper trapezius.",
    "equipment": "dumbbell",
    "primary": [
      "lateral_deltoid",
      "trapezius"
    ],
    "secondary": [
      "anterior_deltoid",
      "biceps_brachii",
      "rhomboids"
    ],
    "instructions": [
      "Stand holding two dumbbells in front of your thighs, palms facing your body.",
      "Pull the dumbbells straight up along your body, leading with your elbows.",
      "Raise until the dumbbells reach chin height and elbows are above the wrists.",
      "Pause briefly, then lower with control.",
      "Repeat for the desired reps."
    ]
  },
  "dumbbell-windmill": {
    "description": "This full-body exercise builds core stability, shoulder strength, and hip mobility by rotating the torso while holding a dumbbell overhead, primarily targeting the obliques and lateral deltoids.",
    "equipment": "dumbbell",
    "primary": [
      "lateral_deltoid",
      "obliques"
    ],
    "secondary": [
      "anterior_deltoid",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart, holding a dumbbell overhead in one hand, arm locked.",
      "Turn your feet slightly away from the dumbbell side, keeping the arm straight and eyes on the weight.",
      "Hinge at your hips, pushing them out to the side of the dumbbell, and slowly lower your torso towards the floor.",
      "Keep your back straight and the dumbbell arm vertical as you reach your free hand towards your foot or the floor.",
      "Reverse the motion by driving through your hips and obliques to return to the starting position.",
      "Complete all reps on one side, then switch and repeat for the other side."
    ]
  },
  "dumbbell-wrist-curl": {
    "description": "A dumbbell wrist curl that isolates the forearm flexors and trains both arms independently.",
    "equipment": "dumbbell",
    "primary": [
      "forearm_flexors"
    ],
    "secondary": [
      "brachioradialis"
    ],
    "instructions": [
      "Sit on a bench with the forearm resting on the thigh, palm up.",
      "Hold a dumbbell with the wrist hanging off the knee.",
      "Let the dumbbell roll down to the fingertips.",
      "Curl the dumbbell up by flexing the wrist.",
      "Lower under control. Complete reps per side."
    ]
  },
  "eagle-pose": {
    "description": "A standing balance with one leg wrapped over the other and the arms twined in front of the chest, holding a narrow, compact shape on a single bent leg.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_medius",
      "quadriceps"
    ],
    "secondary": [
      "posterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Stand tall, bend both knees slightly and shift the weight onto one foot.",
      "Cross the other thigh over the standing thigh and hook the foot behind the calf if it reaches.",
      "Cross the opposite arm underneath, wind the forearms and bring the palms towards each other.",
      "Sit down a little into the standing leg and hold for the prescribed time with the elbows lifted.",
      "Unwind and repeat on the other side."
    ]
  },
  "easy-pose": {
    "description": "A simple cross-legged seat used for breathing and meditation: the pelvis stays upright, the spine is tall and the hips settle without strain.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae"
    ],
    "secondary": [
      "adductors",
      "gluteus_medius"
    ],
    "instructions": [
      "Sit on the floor and cross the shins comfortably, each foot under the opposite knee.",
      "Sit up on a folded blanket or cushion until the knees rest below the level of the hips.",
      "Stack the ribs over the pelvis and let the hands rest on the thighs.",
      "Hold the seat for the prescribed time, breathing slowly and evenly.",
      "Switch which shin is in front on the next round so both sides get equal time."
    ]
  },
  "elliptical-trainer": {
    "description": "A low-impact cardio machine movement in which the feet trace a continuous oval on the foot plates while the moving handles push and pull, working the legs and upper body together.",
    "equipment": "elliptical",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gastrocnemius",
      "hamstrings",
      "latissimus_dorsi",
      "pectoralis_major",
      "soleus",
      "triceps_brachii"
    ],
    "instructions": [
      "Step onto the foot plates one at a time, holding the fixed centre post until you are steady, then take a moving handle in each hand.",
      "Start the pedals turning forward, keeping your whole foot down on the plate rather than lifting your heel.",
      "Push one handle away as the same-side foot travels forward, and pull the other back, so the arms and legs work in opposition.",
      "Stand tall with your hips over the pedals and your core braced instead of hanging back on the handles.",
      "Set the resistance and ramp so you can hold a smooth stride, and continue for the desired time or distance."
    ]
  },
  "extended-side-angle": {
    "description": "A wide-stance standing pose with the front knee bent and the torso extended over the front thigh, so one long line runs from the back heel to the top hand.",
    "equipment": "bodyweight",
    "primary": [
      "obliques",
      "quadriceps"
    ],
    "secondary": [
      "adductors",
      "gluteus_medius"
    ],
    "instructions": [
      "Stand wide with the front foot turned out and the back foot angled slightly in.",
      "Bend the front knee until it stacks over the ankle and keep the back leg straight.",
      "Rest the front forearm on the thigh, or the hand on the floor or a block, and reach the top arm over the ear.",
      "Hold the position for the prescribed time, turning the chest towards the ceiling.",
      "Straighten the front leg to come up and repeat on the other side."
    ]
  },
  "ez-bar-bench-press": {
    "description": "A flat-bench chest press performed with an EZ bar, whose angled grips are easier on the wrists while still loading the pectorals, front delts, and triceps.",
    "equipment": "ez bar",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie flat on a bench with your feet planted on the floor, gripping the EZ bar's angled bends over your chest.",
      "Unrack the bar and hold it over your lower chest with your arms extended.",
      "Lower the bar under control toward your lower chest.",
      "Press the bar back up to full arm extension.",
      "Repeat for the desired number of reps."
    ]
  },
  "ez-bar-curl": {
    "description": "An isolation exercise targeting the biceps using an EZ-bar, which reduces wrist strain compared to a straight barbell.",
    "equipment": "ez bar",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis",
      "brachioradialis"
    ],
    "instructions": [
      "Stand holding an EZ-bar with an underhand grip on the angled portions.",
      "Curl the bar up toward your shoulders, keeping your elbows pinned.",
      "Squeeze at the top, then lower under control.",
      "Repeat."
    ]
  },
  "ez-bar-front-raise": {
    "description": "A two-handed front raise with an EZ-bar. The angled grip is easier on the wrists than a straight bar while still letting both hands drive the same load.",
    "equipment": "ez bar",
    "primary": [
      "anterior_deltoid"
    ],
    "secondary": [
      "serratus_anterior"
    ],
    "instructions": [
      "Stand holding an EZ-bar with an overhand grip on the inner bends, arms hanging in front of the thighs.",
      "Keep the elbows slightly bent and fixed throughout.",
      "Raise the bar in a smooth arc up to shoulder height.",
      "Pause briefly at the top, then lower under control.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "ez-bar-lying-tricep-extension": {
    "description": "A lying triceps extension performed with an EZ bar to isolate the triceps through a full range of motion.",
    "equipment": "ez bar",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Lie on a flat bench holding an EZ bar over your chest with a narrow grip.",
      "Lower the bar toward your forehead by bending at the elbows.",
      "Extend your arms back to the start.",
      "Repeat."
    ]
  },
  "ez-bar-overhead-extension": {
    "description": "Overhead tricep extension with an EZ-bar — the angled grip is easier on the wrists than a straight bar while keeping the long head under a deep stretch.",
    "equipment": "ez bar",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Stand or sit holding an EZ-bar overhead with an overhand grip on the inner bends.",
      "Arms fully extended, bar above the head.",
      "Bend only the elbows to lower the bar behind the head in an arc.",
      "Keep the upper arms vertical and close to the head; only the forearms move.",
      "Extend the elbows to return the bar overhead.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "ez-bar-pullover": {
    "description": "This compound exercise targets the lats and pectorals by extending the arms overhead with an EZ bar, promoting upper body strength and hypertrophy.",
    "equipment": "ez bar",
    "primary": [
      "latissimus_dorsi",
      "pectoralis_major"
    ],
    "secondary": [
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie supine on a flat bench with your head slightly off the end, holding an EZ bar with a pronated grip.",
      "Extend the bar straight above your chest, keeping a slight bend in your elbows.",
      "Slowly lower the bar in an arc behind your head, feeling a stretch in your lats and chest.",
      "Pull the bar back to the starting position using your lats and pectorals.",
      "Maintain control throughout the movement, avoiding momentum."
    ]
  },
  "ez-bar-reverse-curl": {
    "description": "A reverse curl with an EZ-bar targeting the brachialis and forearm extensors with a comfortable grip.",
    "equipment": "ez bar",
    "primary": [
      "brachialis",
      "forearm_extensors"
    ],
    "secondary": [
      "biceps_brachii"
    ],
    "instructions": [
      "Hold an EZ-bar with an overhand grip.",
      "Curl the bar up toward your shoulders.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "ez-bar-reverse-grip-row": {
    "description": "This compound pulling exercise targets the latissimus dorsi and biceps, effectively building back thickness and arm strength with an underhand grip.",
    "equipment": "ez bar",
    "primary": [
      "biceps_brachii",
      "latissimus_dorsi"
    ],
    "secondary": [
      "posterior_deltoid",
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart, holding an EZ bar with an underhand, shoulder-width grip.",
      "Hinge at your hips, keeping a slight bend in your knees and your back straight, until your torso is nearly parallel to the floor.",
      "Let the bar hang directly below your shoulders with arms fully extended.",
      "Pull the bar towards your lower abdomen, squeezing your shoulder blades together and driving your elbows up.",
      "Control the eccentric phase, slowly lowering the bar back to the starting position with full arm extension."
    ]
  },
  "ez-bar-romanian-deadlift": {
    "description": "A Romanian deadlift using an EZ-bar. The angled grip is easier on the wrists and suits lighter hinge work or elbow-sensitive lifters.",
    "equipment": "ez bar",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "forearm_flexors",
      "trapezius"
    ],
    "instructions": [
      "Stand holding an EZ-bar at mid-thigh with an overhand grip on the inner bends.",
      "Feet hip-width, soft bend in the knees, chest up, lats engaged.",
      "Push the hips back while letting the bar slide down the front of the legs.",
      "Go until you feel a deep hamstring stretch without rounding the lower back.",
      "Drive the hips forward to return to standing, keeping the bar close to the body.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "ez-bar-shrug": {
    "description": "A shrug using an EZ-bar for a comfortable grip while loading the trapezius.",
    "equipment": "ez bar",
    "primary": [
      "trapezius"
    ],
    "secondary": [
      "rhomboids"
    ],
    "instructions": [
      "Stand holding an EZ-bar in front of you.",
      "Shrug your shoulders straight up.",
      "Hold at the top, then lower.",
      "Repeat."
    ]
  },
  "ez-bar-spider-curl": {
    "description": "A chest-supported curl over an incline bench with an EZ bar, isolating the biceps with strict form.",
    "equipment": "ez bar",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis",
      "brachioradialis"
    ],
    "instructions": [
      "Lie chest down on an incline bench holding an EZ bar with underhand grip.",
      "Let your arms hang straight down from your shoulders.",
      "Curl the bar up toward your shoulders.",
      "Squeeze your biceps at the top of the movement.",
      "Lower the bar back down with control.",
      "Repeat for the desired number of reps."
    ]
  },
  "ez-bar-upright-row": {
    "description": "An upright row variation using an EZ-bar for more comfortable wrist positioning.",
    "equipment": "ez bar",
    "primary": [
      "lateral_deltoid",
      "trapezius"
    ],
    "secondary": [
      "anterior_deltoid",
      "biceps_brachii"
    ],
    "instructions": [
      "Stand holding an EZ-bar with a shoulder-width grip on the angled portions.",
      "Pull the bar straight up along your body toward your chin.",
      "Lead with your elbows, keeping them above your hands.",
      "Lower with control.",
      "Repeat."
    ]
  },
  "ez-bar-wrist-curl": {
    "description": "A wrist curl with the EZ-bar, friendlier on the wrists than a straight bar.",
    "equipment": "ez bar",
    "primary": [
      "forearm_flexors"
    ],
    "secondary": [],
    "instructions": [
      "Sit on a bench with forearms resting on the thighs, palms up.",
      "Grip an EZ-bar on the inner bends with hands shoulder-width.",
      "Let the bar roll down to the fingertips.",
      "Curl the bar up by flexing the wrists.",
      "Lower under control."
    ]
  },
  "face-pull": {
    "description": "A cable exercise targeting the rear deltoids and external rotators.",
    "equipment": "cable",
    "primary": [
      "posterior_deltoid",
      "rhomboids"
    ],
    "secondary": [
      "trapezius"
    ],
    "instructions": [
      "Attach a rope to a high cable pulley.",
      "Pull the rope toward your face, separating the ends.",
      "Squeeze your rear deltoids and external rotators.",
      "Return to the starting position with control.",
      "Repeat."
    ]
  },
  "fish-pose": {
    "description": "A supine backbend supported on the forearms with the chest lifted and the head tilted back, opening the front of the chest and the throat.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "hip_flexors"
    ],
    "instructions": [
      "Lie on your back with the legs straight and the arms alongside the body, palms down under the hips.",
      "Press the forearms into the floor and lift the chest towards the ceiling.",
      "Let the crown of the head rest lightly on the floor without putting weight through the neck.",
      "Hold the position for the prescribed time, breathing into the upper chest.",
      "Lift the head, then lower the back down."
    ]
  },
  "floor-ez-bar-press": {
    "description": "A floor press variation using an EZ-bar for a more comfortable wrist and elbow position.",
    "equipment": "ez bar",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on the floor holding an EZ-bar over your chest.",
      "Lower the bar until your elbows touch the floor.",
      "Press back up to full extension.",
      "Repeat."
    ]
  },
  "floor-kettlebell-pullover": {
    "description": "A pullover done lying on the floor with a kettlebell held by the handle or by the horns. The floor limits the range of motion compared to the bench version, which reduces shoulder strain and makes it a good home-gym or prehab option.",
    "equipment": "kettlebell",
    "primary": [
      "latissimus_dorsi",
      "pectoralis_major"
    ],
    "secondary": [
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie face-up on the floor with knees bent and feet flat.",
      "Hold a kettlebell by the handle with both hands above your chest, arms almost straight (slight elbow bend).",
      "Keeping the elbow angle fixed, lower the bell overhead in an arc until the upper arms touch the floor.",
      "Pull the bell back above the chest along the same arc.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "floor-press": {
    "description": "A barbell pressing movement performed on the floor, limiting range of motion and taking the lower body out of the equation.",
    "equipment": "barbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on the floor and position yourself under a barbell in a rack.",
      "Lower the barbell to your chest until elbows touch the floor.",
      "Press back up to lockout.",
      "Repeat."
    ]
  },
  "flutter-kicks": {
    "description": "A supine core drill alternating small up-and-down leg kicks while the lower back stays pressed to the floor.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "transverse_abdominis"
    ],
    "instructions": [
      "Lie flat on your back with your legs extended.",
      "Place your hands under your glutes for support.",
      "Lift both legs a few inches off the floor.",
      "Alternate kicking your legs up and down in a small range.",
      "Keep your core braced and lower back pressed down.",
      "Continue for the desired duration or reps."
    ]
  },
  "front-lever": {
    "description": "An advanced static hold under the bar with the body horizontal and chest facing upward, requiring straight-arm pulling strength through the lats and core.",
    "equipment": "pull up bar",
    "primary": [
      "latissimus_dorsi",
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "biceps_brachii",
      "erector_spinae",
      "rectus_abdominis"
    ],
    "instructions": [
      "Grip the bar with an overhand grip and hang.",
      "Tuck your knees to your chest and drive your hips upward, rotating forward until your chest faces up.",
      "Extend your body horizontally with arms straight and chest facing the ceiling.",
      "Keep your body rigid and parallel to the floor.",
      "Hold for the desired duration, then tuck and lower under control."
    ]
  },
  "front-squat": {
    "description": "A barbell squat with the bar held in front on the deltoids, emphasizing quads and core.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings"
    ],
    "instructions": [
      "Clean or rack the bar to your front deltoids with elbows high.",
      "Squat down keeping torso upright until thighs are parallel.",
      "Drive back up.",
      "Repeat."
    ]
  },
  "garland-pose": {
    "description": "A deep bodyweight squat held with the heels down and the elbows pressing the knees open, used to open the hips, ankles and lower back.",
    "equipment": "bodyweight",
    "primary": [
      "adductors",
      "gluteus_maximus"
    ],
    "secondary": [
      "quadriceps",
      "soleus"
    ],
    "instructions": [
      "Stand with the feet a little wider than the hips and the toes turned slightly out.",
      "Squat down as low as the ankles allow, keeping the heels on the floor.",
      "Bring the palms together at the chest and press the elbows against the inner knees.",
      "Hold the position for the prescribed time with the chest lifted and the spine long.",
      "Press through the feet to stand back up."
    ]
  },
  "glute-bridge": {
    "description": "A bodyweight glute activation exercise performed lying on the floor.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Lie on your back with knees bent and feet flat on the floor.",
      "Drive your hips up by squeezing your glutes.",
      "Hold briefly at the top with hips fully extended.",
      "Lower your hips back down with control.",
      "Repeat."
    ]
  },
  "glute-bridge-hold": {
    "description": "The top of the glute bridge held for time: hips fully extended with the shoulders, hips and knees in one line, so the glutes stay under tension instead of cycling through reps.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Lie on your back with the knees bent and the feet flat, about hip-width apart and close enough to brush your fingertips with your heels.",
      "Push through the heels and lift the hips until the body forms a straight line from the knees to the shoulders.",
      "Squeeze the glutes and tuck the ribs down so the lower back does not take over.",
      "Hold the top position for the prescribed time, keeping the weight in the heels.",
      "Lower the hips under control to finish the set."
    ]
  },
  "glute-kickback": {
    "description": "A bodyweight glute isolation exercise performed on all fours to develop gluteus maximus strength and shape.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Begin on all fours with hands under shoulders and knees under hips.",
      "Keeping the knee bent at 90 degrees, drive one heel toward the ceiling.",
      "Squeeze the glute at the top of the movement.",
      "Lower the leg back to the starting position with control.",
      "Complete all reps, then switch sides."
    ]
  },
  "glute-kickback-hold": {
    "description": "The end position of the glute kickback held for time: on all fours with one leg extended back at hip height, the pelvis level and the glute holding the leg in place.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Start on all fours with the hands under the shoulders and the knees under the hips.",
      "Brace the trunk and keep the pelvis level; do not let the working side rotate upwards.",
      "Extend one leg back and up until the thigh is in line with the torso.",
      "Hold that position for the prescribed time, keeping the neck long and the lower back flat.",
      "Lower the leg under control and repeat on the other side."
    ]
  },
  "goblet-squat": {
    "description": "A beginner-friendly squat with a kettlebell held at chest height for improved posture and depth.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Hold a kettlebell at chest height with both hands.",
      "Squat down keeping the weight close to your chest.",
      "Drive back up.",
      "Repeat."
    ]
  },
  "good-morning": {
    "description": "A hip-hinge movement with a barbell on the back for posterior chain development.",
    "equipment": "barbell",
    "primary": [
      "erector_spinae",
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [],
    "instructions": [
      "Stand with a barbell across your upper back.",
      "Hinge at the hips, pushing them back while keeping your back flat.",
      "Lower your torso until it's nearly parallel to the floor.",
      "Drive your hips forward to return to standing.",
      "Repeat."
    ]
  },
  "hack-squat": {
    "description": "A compound lower-body machine exercise on the hack squat sled, targeting the quadriceps through a guided squat pattern.",
    "equipment": "hack squat",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gastrocnemius",
      "hamstrings"
    ],
    "instructions": [
      "Load the hack squat machine and step on, positioning your back and shoulders against the pads.",
      "Place your feet shoulder-width on the platform with toes turned out slightly.",
      "Unlock the safety handles and lower the sled by bending at the knees and hips.",
      "Descend until your thighs are at least parallel to the platform.",
      "Drive through your heels to extend the legs and push the sled back to the start.",
      "Re-engage the safety handles after your final rep."
    ]
  },
  "hack-squat-calf-raise": {
    "description": "A calf raise performed in the hack squat machine, loading the calves heavily without balancing a bar.",
    "equipment": "hack squat",
    "primary": [
      "gastrocnemius",
      "soleus"
    ],
    "secondary": [],
    "instructions": [
      "Load yourself into a hack squat machine with shoulders under the pads.",
      "Place the balls of your feet on the platform with heels hanging off.",
      "Keep your legs straight with a slight knee bend.",
      "Press through the balls of your feet to raise your heels.",
      "Lower your heels back below the platform for a stretch.",
      "Repeat for the desired number of reps."
    ]
  },
  "half-kneeling-hip-flexor-rock": {
    "description": "The dynamic version of the kneeling hip-flexor stretch: from a half-kneeling stance the hips rock forward into the stretch and back out of it, repeated instead of held.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors"
    ],
    "secondary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "instructions": [
      "Kneel on one knee with the other foot flat on the floor in front of you.",
      "Tuck the tailbone slightly and brace the trunk so the lower back stays neutral.",
      "Rock the hips forward until you feel the front of the back thigh lengthen.",
      "Rock back out of the position under control and repeat rhythmically.",
      "Switch sides and repeat for the same number of repetitions."
    ]
  },
  "half-moon-pose": {
    "description": "A standing side balance on one leg and one hand, with the top leg lifted to hip height and the chest turned open towards the ceiling.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_medius",
      "obliques"
    ],
    "secondary": [
      "erector_spinae",
      "quadriceps"
    ],
    "instructions": [
      "From a wide standing stance, bend the front knee and place the bottom hand on the floor or a block ahead of the front foot.",
      "Shift the weight forward and lift the back leg until it is parallel to the floor.",
      "Straighten the standing leg and stack the top hip over the bottom one, reaching the top arm to the ceiling.",
      "Hold the balance for the prescribed time with the lifted foot flexed.",
      "Lower the back foot down and repeat on the other side."
    ]
  },
  "hammer-curl": {
    "description": "A bicep curl variation with a neutral grip targeting the brachioradialis.",
    "equipment": "dumbbell",
    "primary": [
      "biceps_brachii",
      "brachialis"
    ],
    "secondary": [
      "forearm_flexors"
    ],
    "instructions": [
      "Stand holding dumbbells at your sides with palms facing each other.",
      "Curl the weights up while keeping your palms facing inward.",
      "Squeeze at the top, then lower under control.",
      "Repeat."
    ]
  },
  "handstand-push-ups": {
    "description": "An inverted press against a wall, lowering the head to the floor and pressing back up to a full handstand.",
    "equipment": "bodyweight",
    "primary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "secondary": [
      "lateral_deltoid",
      "rectus_abdominis",
      "trapezius"
    ],
    "instructions": [
      "Kick up into a handstand against a wall with hands shoulder-width apart.",
      "Brace your core and keep your body straight.",
      "Lower your head toward the floor by bending your elbows.",
      "Stop just before your head touches the ground.",
      "Press through your hands to return to full handstand.",
      "Repeat for the desired number of reps."
    ]
  },
  "hang-clean": {
    "description": "A clean variation starting with the barbell at the thighs, training explosive triple extension and a fast catch.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps",
      "trapezius"
    ],
    "secondary": [
      "anterior_deltoid",
      "erector_spinae",
      "hamstrings"
    ],
    "instructions": [
      "Stand holding a barbell with a shoulder-width grip at your thighs.",
      "Hinge at the hips to lower the bar just above your knees.",
      "Explosively extend your hips, knees, and ankles.",
      "Shrug your shoulders and pull the bar up.",
      "Catch the bar on your front shoulders in a quarter squat.",
      "Stand tall, then return to the hang position."
    ]
  },
  "hang-power-clean": {
    "description": "A clean from the hang caught in a partial squat, building explosive power without dropping into a full squat.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps",
      "trapezius"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings"
    ],
    "instructions": [
      "Stand with feet hip-width apart holding a barbell at your thighs.",
      "Hinge at the hips to lower the bar to just above the knees.",
      "Drive through your hips and legs explosively.",
      "Pull the bar up and catch it on your front shoulders in a partial squat.",
      "Stand tall with the bar racked on your shoulders.",
      "Lower the bar back to the hang position."
    ]
  },
  "hanging-knee-raise": {
    "description": "A hanging core exercise on a pull-up bar that targets the lower abs and hip flexors with bent knees.",
    "equipment": "pull up bar",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "forearm_flexors",
      "obliques"
    ],
    "instructions": [
      "Hang from a pull-up bar with an overhand grip, arms fully extended.",
      "Engage your core and raise your knees toward your chest.",
      "Hold briefly at the top.",
      "Lower your legs slowly back to the starting position.",
      "Repeat for the desired reps."
    ]
  },
  "hanging-leg-raise": {
    "description": "An advanced core exercise performed hanging from a bar.",
    "equipment": "pull up bar",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques"
    ],
    "instructions": [
      "Hang from a pull-up bar with an overhand grip.",
      "Raise your legs in front of you until they are parallel to the floor.",
      "Hold briefly, then lower with control.",
      "Avoid swinging.",
      "Repeat."
    ]
  },
  "hanging-pike": {
    "description": "A strict hanging leg raise taken to the bar — legs stay straight and the feet rise all the way to the hands.",
    "equipment": "pull up bar",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "forearm_flexors",
      "hip_flexors",
      "latissimus_dorsi"
    ],
    "instructions": [
      "Hang from a pull-up bar with a shoulder-width overhand grip.",
      "Engage the lats and brace the core to create a hollow body.",
      "Keeping the legs perfectly straight, lift them in a smooth arc up to the bar.",
      "Aim to touch the toes to the bar between the hands.",
      "Lower the legs slowly back to the hanging position and repeat."
    ]
  },
  "happy-baby": {
    "description": "A supine hip opener in which the knees are drawn towards the armpits and the feet are held from the outside, releasing the inner thighs and lower back.",
    "equipment": "bodyweight",
    "primary": [
      "adductors",
      "gluteus_maximus"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings"
    ],
    "instructions": [
      "Lie on your back and draw both knees towards the chest.",
      "Take hold of the outside edges of the feet, or the shins if the feet are out of reach.",
      "Open the knees wider than the ribs and stack the ankles above the knees, soles facing up.",
      "Press the feet gently into the hands and hold for the prescribed time with the lower back on the floor.",
      "Release the feet and lower the legs."
    ]
  },
  "head-to-knee-pose": {
    "description": "A seated one-legged fold: one leg stays straight while the other foot rests against the inner thigh, so the hamstring of the straight leg lengthens one side at a time.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "hamstrings"
    ],
    "secondary": [
      "adductors",
      "gluteus_maximus"
    ],
    "instructions": [
      "Sit with one leg straight in front of you and the other knee bent out to the side, that foot at the inner thigh.",
      "Turn the chest towards the straight leg so the navel lines up with the thigh.",
      "Hinge from the hips and reach forward along the straight leg with a long spine.",
      "Hold the fold for the prescribed time, breathing into the back of the leg.",
      "Come up with a flat back and repeat on the other side."
    ]
  },
  "heel-elevated-squat": {
    "description": "A squat variation with heels raised on plates or a wedge to shift emphasis onto the quadriceps and improve depth.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "adductors",
      "erector_spinae",
      "hamstrings"
    ],
    "instructions": [
      "Place weight plates or a wedge under your heels, feet shoulder-width apart.",
      "Hold a barbell across your upper back or hold dumbbells at your sides.",
      "Brace your core and descend into a squat, keeping your torso upright.",
      "Squat until thighs are parallel to the floor or lower.",
      "Drive through your feet to return to the starting position."
    ]
  },
  "heel-to-toe-walk": {
    "description": "A balance and coordination drill walked along an imaginary line, placing the heel of each step directly against the toes of the other foot so the base of support narrows to almost nothing.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_medius",
      "soleus"
    ],
    "secondary": [
      "gastrocnemius",
      "quadriceps",
      "transverse_abdominis"
    ],
    "instructions": [
      "Pick a straight line on the floor and stand on it with your arms out to your sides at shoulder height.",
      "Step forward and place your heel directly in front of — and touching — the toes of the standing foot.",
      "Shift your weight onto the front foot under control, pausing for a moment before the next step.",
      "Bring the back foot through and place it heel to toe again, staying on the line rather than stepping around it.",
      "Look ahead at a fixed point instead of down at your feet, and use your arms to correct any wobble.",
      "Walk the desired number of steps, then turn around and walk back."
    ]
  },
  "hero-pose": {
    "description": "A kneeling seat with the hips settling between the heels, which lengthens the quadriceps and the front of the ankles while the spine stays tall.",
    "equipment": "bodyweight",
    "primary": [
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "hip_flexors"
    ],
    "instructions": [
      "Kneel with the knees together and the feet slightly wider than the hips, tops of the feet flat.",
      "Sit the hips back and down between the heels, using a block or cushion if the floor is out of reach.",
      "Stack the ribs over the pelvis and rest the hands on the thighs.",
      "Hold the seat for the prescribed time, keeping the weight even on both sit bones.",
      "Come out by pressing into the hands and straightening one leg at a time."
    ]
  },
  "hex-bar-deadlift": {
    "description": "A deadlift standing inside a hex (trap) bar, keeping the load centered for a more upright, back-friendly pull.",
    "equipment": "trap bar",
    "primary": [
      "erector_spinae",
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "forearm_flexors",
      "hamstrings",
      "trapezius"
    ],
    "instructions": [
      "Stand inside a loaded trap bar with feet shoulder-width apart.",
      "Hinge at the hips and knees to grip the handles.",
      "Brace your core and set your back flat.",
      "Drive through your heels and extend hips and knees to stand up.",
      "Lock out at the top with shoulders pulled back.",
      "Lower the bar back to the floor under control."
    ]
  },
  "high-foot-leg-press": {
    "description": "A leg press with the feet placed high on the platform, shifting more of the movement toward hip extension and the gluteus maximus while the back stays supported.",
    "equipment": "leg press",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings",
      "quadriceps"
    ],
    "instructions": [
      "Set the back pad and seat so your lower back stays supported and your knees can bend without your pelvis rolling under.",
      "Place both feet high on the platform at about shoulder width, with the toes tracking in the same direction as the knees.",
      "Lower the sled by bending the hips and knees until you reach a comfortable depth without the lower back lifting from the pad.",
      "Press through the whole foot and extend the hips and knees without locking the knees aggressively.",
      "Lower the sled under control and repeat for the desired number of repetitions."
    ]
  },
  "high-knees": {
    "description": "A bodyweight cardio drill where the knees are driven up to hip height in rapid alternation.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "quadriceps"
    ],
    "secondary": [
      "gastrocnemius",
      "rectus_abdominis"
    ],
    "instructions": [
      "Stand tall with feet hip-width apart.",
      "Drive one knee up toward the chest while pumping the opposite arm.",
      "Quickly switch legs, mirroring the arm action.",
      "Continue alternating at a fast pace.",
      "Continue for the prescribed work interval."
    ]
  },
  "high-plank": {
    "description": "A plank variation with arms fully extended in a push-up position.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis",
      "transverse_abdominis"
    ],
    "secondary": [
      "erector_spinae",
      "obliques"
    ],
    "instructions": [
      "Start in a push-up position with arms fully extended.",
      "Keep your body in a straight line from head to heels.",
      "Brace your core and hold the position.",
      "Breathe steadily throughout."
    ]
  },
  "hip-abduction": {
    "description": "A machine exercise targeting the outer hip muscles.",
    "equipment": "hip abduction machine",
    "primary": [
      "gluteus_medius"
    ],
    "secondary": [
      "abductors"
    ],
    "instructions": [
      "Sit in the hip abduction machine with pads against your outer thighs.",
      "Push your legs apart against the resistance.",
      "Hold briefly at the widest point.",
      "Return to the starting position with control.",
      "Repeat."
    ]
  },
  "hip-adduction": {
    "description": "A machine exercise pressing the legs together against resistance, isolating and strengthening the inner-thigh adductors.",
    "equipment": "hip adduction machine",
    "primary": [
      "adductors"
    ],
    "secondary": [],
    "instructions": [
      "Sit on the hip adduction machine with your back against the pad.",
      "Place your legs against the pads with the machine set to a comfortable stretch.",
      "Squeeze your legs together until the pads meet in the middle.",
      "Hold the squeeze briefly in the fully closed position.",
      "Let your legs open back out under control to the start.",
      "Repeat for the desired number of reps."
    ]
  },
  "hip-thrust": {
    "description": "A compound glute exercise using a barbell across the hips.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "gluteus_medius"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Sit on the floor with your upper back against a bench, barbell across your hips.",
      "Drive your hips up until your thighs are parallel to the floor.",
      "Squeeze your glutes at the top.",
      "Lower your hips back down with control.",
      "Repeat."
    ]
  },
  "hollow-body-hold": {
    "description": "An isometric core hold borrowed from gymnastics, training total-body tension with the spine in a slight C-shape.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "hip_flexors",
      "obliques",
      "transverse_abdominis"
    ],
    "instructions": [
      "Lie on your back with arms extended overhead and legs straight.",
      "Press the lower back firmly into the floor.",
      "Lift the shoulders, head, and legs slightly off the floor.",
      "Hold the position with arms and legs extended, body in a shallow banana shape.",
      "Hold for the prescribed time."
    ]
  },
  "horizontal-leg-press": {
    "description": "A machine leg press performed horizontally, targeting quads, glutes, and hamstrings.",
    "equipment": "leg press",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Sit in a horizontal leg press machine and place feet shoulder-width apart.",
      "Unlock the machine and lower the platform toward your chest.",
      "Press the platform back to the start.",
      "Repeat."
    ]
  },
  "human-flag": {
    "description": "An advanced calisthenics isometric hold with the body horizontal on a vertical pole, parallel to the ground.",
    "equipment": "pull up bar",
    "primary": [
      "latissimus_dorsi",
      "obliques"
    ],
    "secondary": [
      "anterior_deltoid",
      "gluteus_maximus",
      "pectoralis_major",
      "rectus_abdominis",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand close to a sturdy vertical pole.",
      "Grip the pole high with the top hand (overhand) and lower with the bottom hand (underhand).",
      "Kick the legs up and out while pressing the bottom arm hard against the pole.",
      "Extend the body horizontally so it forms a straight line parallel to the ground.",
      "Hold the position with the body rigid for the target time.",
      "Lower under control."
    ]
  },
  "incline-bench-ez-bar-press": {
    "description": "An incline press with an EZ-bar targeting the upper chest with a joint-friendly grip.",
    "equipment": "ez bar",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Set bench to 30–45 degrees. Grip the EZ-bar with hands on the angled sections.",
      "Lower the bar to your upper chest.",
      "Press back up to full extension.",
      "Repeat."
    ]
  },
  "incline-bench-press": {
    "description": "A barbell pressing movement on an incline bench targeting the upper chest.",
    "equipment": "barbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on an incline bench set to 30-45 degrees.",
      "Grip the bar slightly wider than shoulder-width and unrack.",
      "Lower the bar to your upper chest.",
      "Press the bar back up to full extension.",
      "Repeat."
    ]
  },
  "incline-db-curl": {
    "description": "A bicep curl on an incline bench for a deeper stretch of the long head.",
    "equipment": "dumbbell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis"
    ],
    "instructions": [
      "Sit on an incline bench set to 45 degrees, holding dumbbells at your sides.",
      "Let your arms hang straight down with palms forward.",
      "Curl the dumbbells up toward your shoulders.",
      "Lower with control to full extension.",
      "Repeat."
    ]
  },
  "incline-db-press": {
    "description": "An incline pressing movement emphasizing the upper chest.",
    "equipment": "dumbbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Set bench to 30-degree incline and sit back with dumbbells at shoulder level.",
      "Press dumbbells up and together until arms are fully extended.",
      "Lower dumbbells back to shoulder level with control.",
      "Repeat."
    ]
  },
  "incline-dumbbell-fly": {
    "description": "An incline isolation exercise opening dumbbells in a wide arc, stretching and targeting the upper chest.",
    "equipment": "dumbbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "biceps_brachii"
    ],
    "instructions": [
      "Lie back on an incline bench holding dumbbells above your chest.",
      "Press the dumbbells up with palms facing each other.",
      "Maintain a slight bend in your elbows throughout.",
      "Lower the dumbbells in a wide arc until you feel a chest stretch.",
      "Squeeze your chest to bring the dumbbells back together.",
      "Repeat for the desired number of reps."
    ]
  },
  "incline-hammer-curl": {
    "description": "A hammer curl performed on an incline bench for increased stretch and biceps long-head activation.",
    "equipment": "dumbbell",
    "primary": [
      "biceps_brachii",
      "brachialis"
    ],
    "secondary": [
      "forearm_flexors"
    ],
    "instructions": [
      "Sit on an incline bench holding dumbbells with a neutral grip.",
      "Allow arms to hang straight.",
      "Curl the dumbbells up in a hammer motion.",
      "Lower slowly.",
      "Repeat."
    ]
  },
  "incline-push-ups": {
    "description": "A beginner-friendly push-up variation with hands elevated on a bench or step.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Place your hands on a bench or elevated surface, shoulder-width apart.",
      "Extend your legs behind you into a plank position.",
      "Lower your chest toward the bench by bending your elbows.",
      "Push back up to the starting position.",
      "Repeat."
    ]
  },
  "incline-treadmill-walk": {
    "description": "A steady uphill walk on an inclined treadmill belt, keeping one foot in contact with the belt throughout so the glutes and hamstrings work hard with almost no impact.",
    "equipment": "treadmill",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gastrocnemius",
      "hamstrings",
      "soleus"
    ],
    "instructions": [
      "Start the belt at a slow walking speed and step on, then raise the incline to your target gradient.",
      "Walk with a long, deliberate stride, rolling from heel to toe and pushing the belt away behind you with each step.",
      "Stand tall and lean from the ankles with the hill rather than folding forward at the waist.",
      "Keep at least one foot on the belt at all times — walk the hill, do not break into a jog.",
      "Let your arms swing naturally, or rest them lightly on the rails for balance without carrying your weight on them.",
      "Hold the gradient for the desired time, then lower the incline and walk level for a few minutes to finish."
    ]
  },
  "inverted-row": {
    "description": "A horizontal bodyweight pulling exercise performed under a fixed bar, pulling the chest to the bar while keeping the body rigid.",
    "equipment": "barbell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids",
      "trapezius"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "rectus_abdominis"
    ],
    "instructions": [
      "Set a barbell in a rack at about waist height.",
      "Lie underneath and grip the bar slightly wider than shoulder-width with an overhand grip.",
      "Hang with arms extended, heels on the floor, body straight from head to ankles.",
      "Pull your chest to the bar, squeezing the shoulder blades together.",
      "Lower yourself under control until arms are fully extended.",
      "Repeat."
    ]
  },
  "isometric-neck-side": {
    "description": "A static side-neck drill using the hand as resistance against the head, training the sternocleidomastoid and scalene without hardware.",
    "equipment": "bodyweight",
    "primary": [
      "trapezius"
    ],
    "secondary": [],
    "instructions": [
      "Sit or stand tall. Place the palm of one hand against the side of the head, above the ear.",
      "Press the head into the hand while resisting equally with the hand — the head does not move.",
      "Hold the isometric contraction for 5 to 10 seconds.",
      "Release slowly, then repeat on the same side for the set.",
      "Switch sides and repeat."
    ]
  },
  "jackknife-sit-up": {
    "description": "A full-body crunch performed from a floor-hover position, lifting both legs and torso simultaneously to touch hands to feet.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "hip_flexors",
      "obliques"
    ],
    "instructions": [
      "Lie face-up on the floor with arms extended overhead and legs extended straight.",
      "Simultaneously lift the torso and the straight legs off the floor.",
      "Reach the hands up toward the feet as the feet rise — meet above the hips.",
      "Lower the torso and legs back to the floor under control.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "jefferson-curl": {
    "description": "A loaded spinal-flexion drill: standing tall with a light weight, you round the spine one vertebra at a time and restack it, building segmental control and hamstring/spinal-erector flexibility under load.",
    "equipment": "dumbbell",
    "primary": [
      "erector_spinae",
      "hamstrings"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Stand tall holding a light dumbbell with straight arms, feet roughly hip-width.",
      "Tuck your chin and begin rounding the spine from the top, one vertebra at a time.",
      "Curl down slowly, letting the weight hang and keeping the legs mostly straight.",
      "Reach the bottom with the back fully rounded and a stretch through the hamstrings.",
      "Reverse it, restacking the spine from the bottom up back to standing."
    ]
  },
  "jump-rope": {
    "description": "A classic cardio drill that trains calves, ankles, and timing with a rope and rhythmic hops.",
    "equipment": "jump rope",
    "primary": [
      "gastrocnemius",
      "soleus"
    ],
    "secondary": [
      "forearm_flexors",
      "quadriceps"
    ],
    "instructions": [
      "Hold a jump rope handle in each hand with the rope behind you.",
      "Swing the rope overhead and forward in a smooth arc.",
      "Hop just high enough for the rope to pass under your feet.",
      "Land softly on the balls of the feet, knees slightly bent.",
      "Keep a steady rhythm for the prescribed interval."
    ]
  },
  "jump-squat": {
    "description": "A plyometric bodyweight squat where you explode upward into a vertical jump.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gastrocnemius",
      "hamstrings"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart.",
      "Drop into a quarter-squat with the arms back.",
      "Explode upward, swinging the arms up and jumping as high as you can.",
      "Land softly back into a quarter-squat to absorb impact.",
      "Repeat without pausing for the prescribed reps."
    ]
  },
  "jumping-jacks": {
    "description": "This classic full-body dynamic exercise elevates heart rate and targets the calves, shoulders, quads, and glutes, making it an excellent warm-up or conditioning movement.",
    "equipment": "bodyweight",
    "primary": [
      "gastrocnemius",
      "gluteus_medius",
      "lateral_deltoid"
    ],
    "secondary": [
      "abductors",
      "quadriceps",
      "soleus"
    ],
    "instructions": [
      "Stand tall with feet together and arms at your sides.",
      "Simultaneously jump your feet out wide and raise your arms overhead.",
      "Ensure your arms meet or nearly meet above your head.",
      "Jump your feet back together while lowering your arms to your sides.",
      "Maintain a continuous, rhythmic motion."
    ]
  },
  "kettlebell-bulgarian-split-squat": {
    "description": "This unilateral squat variation builds lower body strength, muscle, and stability by elevating the rear foot and holding a kettlebell, primarily targeting the quadriceps and glutes.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand facing away from a bench, placing one foot on it behind you, laces down. Hold a kettlebell in the opposite hand.",
      "Maintain an upright torso and engage your core.",
      "Lower your body by bending both knees, allowing your front knee to track over your toes.",
      "Descend until your front thigh is parallel to the floor or slightly below, keeping your rear knee close to the ground.",
      "Drive through your front heel to return to the starting position, extending your hips and knees.",
      "Complete all reps per side before switching."
    ]
  },
  "kettlebell-close-grip-floor-press": {
    "description": "A floor press performed with a single kettlebell gripped close together with both hands. The narrow grip and the floor stop on the elbows shift emphasis off the chest and onto the triceps, with no shoulder hyperextension.",
    "equipment": "kettlebell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "pectoralis_major"
    ],
    "instructions": [
      "Lie on your back on the floor with the knees bent and feet flat.",
      "Hold a single kettlebell by the handle with both hands, close together, the bell resting on the chest with elbows tucked tight to the ribs.",
      "Brace the core and press the kettlebell straight up until the arms are fully extended.",
      "Lower under control until the upper arms touch the floor and pause briefly.",
      "Press back up to lockout.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "kettlebell-concentration-curl": {
    "description": "A seated single-arm bicep isolation move: the elbow braces against the inner thigh while curling a kettlebell, keeping the upper arm still so the bicep does all the work.",
    "equipment": "kettlebell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis"
    ],
    "instructions": [
      "Sit on a bench with your feet wide, holding a kettlebell in one hand.",
      "Brace the back of your upper arm against the inside of your thigh, letting the kettlebell hang.",
      "Curl the kettlebell up toward your shoulder, keeping the elbow pinned against your leg.",
      "Squeeze the bicep at the top, then lower slowly under control.",
      "Finish all reps on one side, then switch arms."
    ]
  },
  "kettlebell-deadlift": {
    "description": "A foundational hip-hinge pull lifting a kettlebell from the floor, training the glutes, hamstrings, and lower back.",
    "equipment": "kettlebell",
    "primary": [
      "erector_spinae",
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "forearm_flexors",
      "quadriceps"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart and kettlebell between your feet.",
      "Hinge at the hips and bend your knees to grip the handle.",
      "Brace your core and set your back flat.",
      "Drive through your heels to stand up with the kettlebell.",
      "Lock out at the top with shoulders pulled back.",
      "Lower the kettlebell back to the floor with control."
    ]
  },
  "kettlebell-farmers-walk": {
    "description": "A loaded carry with heavy kettlebells at the sides, building grip strength and full-body stability.",
    "equipment": "kettlebell",
    "primary": [
      "forearm_flexors",
      "trapezius"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_maximus",
      "quadriceps",
      "rectus_abdominis"
    ],
    "instructions": [
      "Stand between two heavy dumbbells or farmer handles.",
      "Hinge and grip the handles firmly with a neutral grip.",
      "Stand tall with shoulders back and core braced.",
      "Walk forward with short, controlled steps.",
      "Maintain an upright posture throughout the walk.",
      "Set the weights down at the end of the distance."
    ]
  },
  "kettlebell-floor-press": {
    "description": "A two-arm chest press performed lying on the floor with a kettlebell in each hand. The floor caps the ROM (triceps hit the floor before full stretch), making it shoulder-friendly and a great home option.",
    "equipment": "kettlebell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on your back on the floor with knees bent, feet flat.",
      "Hold a kettlebell in each hand at the chest, bells resting on the outer forearms.",
      "Press both kettlebells straight up until the arms are fully extended.",
      "Lower under control until the triceps touch the floor — do not bounce.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "kettlebell-goblet-lunge": {
    "description": "This unilateral compound exercise strengthens the quadriceps, glutes, and hamstrings by performing a lunge while holding a kettlebell in the goblet position, improving lower body strength and stability.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand tall holding a kettlebell by its horns at chest height, elbows tucked, in the goblet position.",
      "Take a controlled step forward with one leg, lowering your hips until both knees are bent at approximately 90 degrees.",
      "Ensure your front knee is stacked over your ankle and your rear knee hovers just above the floor.",
      "Drive through your front heel to return to the starting position, maintaining balance and core tension.",
      "Complete all repetitions on one side before switching, or alternate legs per set."
    ]
  },
  "kettlebell-halo": {
    "description": "A shoulder-mobility drill where a kettlebell is circled around the head. Warms up the rotator cuff, thoracic spine, and shoulder girdle with minimal load.",
    "equipment": "kettlebell",
    "primary": [
      "lateral_deltoid"
    ],
    "secondary": [
      "posterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Stand tall, core braced, holding a light kettlebell by the horns (upside down) at chest height.",
      "Raise the bell to one side of your head and pass it around the back in a smooth circle.",
      "Bring it back to the starting position in front of your face.",
      "Reverse direction every few reps.",
      "Repeat for the recommended number of repetitions or time."
    ]
  },
  "kettlebell-hammer-curl": {
    "description": "A neutral-grip curl gripping the handle of a kettlebell so that the bell hangs alongside the wrist. The offset mass and neutral grip bias the brachialis and brachioradialis.",
    "equipment": "kettlebell",
    "primary": [
      "biceps_brachii",
      "brachialis"
    ],
    "secondary": [
      "brachioradialis"
    ],
    "instructions": [
      "Stand holding a kettlebell in one hand, gripping the handle in a neutral position (palm facing the body).",
      "The bell rests on or beside the forearm.",
      "Keep the elbow tucked to the side and curl the bell up toward the shoulder.",
      "Squeeze at the top, then lower under control.",
      "Complete all reps on one side, then switch."
    ]
  },
  "kettlebell-hip-thrust": {
    "description": "This exercise effectively targets the gluteus maximus and hamstrings, using a kettlebell to add resistance for powerful hip extension and glute development.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings",
      "quadriceps"
    ],
    "instructions": [
      "Sit on the floor with your upper back against a bench, knees bent, and feet flat.",
      "Place a kettlebell across your hips, holding it securely with both hands.",
      "Drive through your heels, lifting your hips off the floor until your body forms a straight line from shoulders to knees.",
      "Squeeze your glutes forcefully at the top of the movement.",
      "Slowly lower your hips back down to the starting position with control."
    ]
  },
  "kettlebell-kickstand-deadlift": {
    "description": "A staggered-stance hip hinge with one kettlebell that loads the front leg while the back foot lightly stabilizes.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "adductors",
      "erector_spinae"
    ],
    "instructions": [
      "Stand tall and step one foot back so only the toes touch the floor.",
      "Hold a kettlebell in one hand at hip height.",
      "Hinge at the hips, lowering the kettlebell toward mid-shin while keeping the back flat.",
      "Keep most of your weight on the front foot throughout.",
      "Drive through the front heel to return to standing. Switch sides after all reps."
    ]
  },
  "kettlebell-lunge-press": {
    "description": "A combination exercise pressing a kettlebell overhead with one arm while lunging, training legs, shoulders, and core.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid",
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings",
      "rectus_abdominis",
      "triceps_brachii"
    ],
    "instructions": [
      "Hold a kettlebell at shoulder height with one arm.",
      "Step forward into a lunge with the opposite leg.",
      "As you lunge, press the kettlebell overhead.",
      "Lock out the arm at the top of the press.",
      "Step back to standing while lowering the kettlebell.",
      "Complete reps on one side, then switch."
    ]
  },
  "kettlebell-offset-reverse-lunge-and-press": {
    "description": "A reverse lunge with a single kettlebell pressed overhead, the offset load challenging balance and core stability.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid",
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings",
      "obliques",
      "triceps_brachii"
    ],
    "instructions": [
      "Hold a kettlebell at shoulder height on one side.",
      "Step backward into a reverse lunge with the opposite leg.",
      "As you reach the bottom of the lunge, press the kettlebell overhead.",
      "Drive through your front heel to return to standing.",
      "Lower the kettlebell back to shoulder height.",
      "Complete reps on one side, then switch."
    ]
  },
  "kettlebell-overhead-carry": {
    "description": "A loaded walk with a single kettlebell locked out overhead, where the bell hangs behind the wrist and pulls the arm backwards, making it harder to hold still than a dumbbell.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "forearm_extensors",
      "obliques",
      "quadratus_lumborum",
      "serratus_anterior",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Clean and press a kettlebell to lockout, letting the bell settle on the back of your forearm.",
      "Straighten the elbow fully and turn the arm so the bell sits behind and above your wrist rather than off to the side.",
      "Pack the shoulder — push the weight up and let the shoulder blade travel with it instead of jamming it down.",
      "Brace your trunk and walk forward with even strides, keeping the bell stacked over your shoulder and hip.",
      "Keep your wrist straight; letting it bend back is what makes an overhead bell feel unstable.",
      "Carry for the desired distance, lower under control, then repeat on the other side."
    ]
  },
  "kettlebell-overhead-tricep-extension": {
    "description": "An overhead tricep extension holding a kettlebell by the horns with both hands. The offset load pulls the bell behind the head for a deep long-head stretch.",
    "equipment": "kettlebell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Stand or sit holding a kettlebell by the horns (upside down) with both hands overhead.",
      "Arms fully extended, bell above the head.",
      "Bend only the elbows to lower the bell behind the head in a controlled arc.",
      "Keep the upper arms vertical and close to the head; only the forearms move.",
      "Extend the elbows to return the bell overhead.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "kettlebell-pistol-squat": {
    "description": "An advanced single-leg squat performed holding a kettlebell at the chest for counterbalance.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings",
      "rectus_abdominis"
    ],
    "instructions": [
      "Hold a kettlebell at your chest with both hands.",
      "Stand on one leg with the other leg extended forward.",
      "Lower your hips down into a one-legged squat.",
      "Keep your raised leg off the floor throughout.",
      "Drive through your standing heel to return to standing.",
      "Complete reps on one side, then switch."
    ]
  },
  "kettlebell-pullover": {
    "description": "A pullover on a flat bench with a kettlebell held by the horns. The deep overhead stretch hits the lats, long-head triceps, and serratus.",
    "equipment": "kettlebell",
    "primary": [
      "latissimus_dorsi",
      "pectoralis_major"
    ],
    "secondary": [
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on a flat bench holding a kettlebell by the horns with both hands above the chest, arms nearly straight (slight elbow bend).",
      "Keeping the elbow angle fixed, lower the bell overhead in an arc until the upper arms are in line with the torso.",
      "Pull the bell back above the chest along the same arc.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "kettlebell-reverse-lunge": {
    "description": "This compound unilateral exercise builds lower body strength and stability, primarily targeting the glutes and quads while engaging hamstrings, glute medius, and obliques.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings",
      "obliques"
    ],
    "instructions": [
      "Stand tall with a kettlebell held in one hand, arm extended down, on the same side as the leg that will lunge back.",
      "Step one leg straight back, lowering your hips until both knees are bent at approximately 90 degrees.",
      "Keep your front shin vertical and your chest upright, ensuring your back knee hovers just above the floor.",
      "Drive through your front heel to return to the starting position.",
      "Complete all reps per side before switching to the other side."
    ]
  },
  "kettlebell-reverse-wrist-curl": {
    "description": "A unilateral reverse wrist curl with a kettlebell, training the forearm extensors.",
    "equipment": "kettlebell",
    "primary": [
      "forearm_extensors"
    ],
    "secondary": [],
    "instructions": [
      "Sit on a bench with the forearm on the thigh, palm down.",
      "Hold a kettlebell by the handle with the wrist hanging off the knee.",
      "Let the wrist drop, lowering the kettlebell.",
      "Lift the back of the hand by extending the wrist.",
      "Lower under control. Complete reps per side."
    ]
  },
  "kettlebell-rotational-lunge": {
    "description": "A lateral lunge holding a kettlebell, adding a torso rotation to work the legs and obliques together.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings",
      "obliques"
    ],
    "instructions": [
      "Hold a kettlebell with both hands at your chest.",
      "Step to one side into a lateral lunge.",
      "Rotate your torso toward the lunging leg.",
      "Bring the kettlebell down toward the bent knee.",
      "Push off the lunging leg to return to center.",
      "Complete reps on one side, then switch."
    ]
  },
  "kettlebell-russian-twist": {
    "description": "A seated rotational core exercise twisting a kettlebell from side to side with the feet lifted.",
    "equipment": "kettlebell",
    "primary": [
      "obliques"
    ],
    "secondary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "instructions": [
      "Sit on the floor with your knees bent and feet lifted off the ground.",
      "Hold a kettlebell with both hands in front of your chest.",
      "Lean back slightly to engage your core.",
      "Rotate your torso to one side, bringing the kettlebell next to your hip.",
      "Rotate to the opposite side in a controlled motion.",
      "Repeat for the desired number of reps."
    ]
  },
  "kettlebell-shrug": {
    "description": "This isolation exercise targets the upper trapezius muscles by elevating the shoulders, enhancing shoulder stability and neck strength.",
    "equipment": "kettlebell",
    "primary": [
      "trapezius"
    ],
    "secondary": [
      "forearm_flexors"
    ],
    "instructions": [
      "Stand tall with feet hip-width apart, holding a kettlebell in each hand with palms facing your body.",
      "Keep your arms straight and shoulders relaxed.",
      "Elevate your shoulders straight up towards your ears, squeezing your traps at the top.",
      "Hold the contraction briefly.",
      "Slowly lower your shoulders back to the starting position with control.",
      "Repeat for the desired number of repetitions."
    ]
  },
  "kettlebell-single-leg-deadlift": {
    "description": "A single-leg hip hinge holding a kettlebell, training the hamstrings and glutes while challenging balance.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius"
    ],
    "instructions": [
      "Hold a kettlebell in one hand and stand on the opposite leg.",
      "Hinge at the hip and lower the kettlebell toward the floor.",
      "Extend your free leg straight back for balance.",
      "Lower until your torso is parallel to the floor.",
      "Drive through your standing heel to return to standing.",
      "Complete reps on one side, then switch."
    ]
  },
  "kettlebell-skull-crusher": {
    "description": "A skull crusher lying on a flat bench, holding a kettlebell by the horns with both hands. The offset mass hangs below the wrists, adding a grip and control challenge.",
    "equipment": "kettlebell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Lie on a flat bench holding a kettlebell by the horns with both hands, arms extended above the chest.",
      "Bend only the elbows to lower the bell toward the forehead in a controlled arc.",
      "Keep the upper arms vertical; only the forearms move.",
      "Extend the elbows to press the bell back up.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "kettlebell-squat": {
    "description": "A squat variation holding a kettlebell with both hands hanging low between the legs, adding load to a standard bodyweight squat pattern.",
    "equipment": "kettlebell",
    "primary": [
      "quadriceps"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart, holding a kettlebell with both hands in front of you.",
      "Let the kettlebell hang naturally between your legs as you brace your core.",
      "Bend your hips and knees to squat down, keeping the kettlebell close to your body.",
      "Drive through your feet to stand back up to the starting position.",
      "Repeat for the desired number of reps."
    ]
  },
  "kettlebell-sumo-deadlift": {
    "description": "A wide-stance deadlift with a single kettlebell between the feet. The wide stance and close-to-body load make this a quad-and-glute-dominant pattern that is easy to learn.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "adductors",
      "erector_spinae",
      "hamstrings",
      "trapezius"
    ],
    "instructions": [
      "Stand in a wide stance with toes pointed slightly out, a kettlebell on the floor between the feet.",
      "Hinge down with a flat back, knees tracking over the toes, and grip the handle with both hands.",
      "Drive through the floor and extend the hips and knees together to stand up.",
      "Squeeze the glutes at the top.",
      "Lower the bell under control back to the floor by pushing the hips back.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "kettlebell-sumo-high-pull": {
    "description": "A wide-stance kettlebell pull from the floor to chin height, combining a hinge with an upright row for explosive upper-trap development.",
    "equipment": "kettlebell",
    "primary": [
      "adductors",
      "lateral_deltoid",
      "trapezius"
    ],
    "secondary": [
      "gluteus_maximus",
      "hamstrings",
      "posterior_deltoid"
    ],
    "instructions": [
      "Stand with feet wider than shoulder-width, toes slightly turned out, a kettlebell on the floor between the feet.",
      "Hinge down and grip the handle with both hands.",
      "Drive through the feet and extend the hips explosively to pull the kettlebell up.",
      "As it rises, pull the elbows up and out until the handle reaches chin height.",
      "Lower the kettlebell back between the legs under control.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "kettlebell-svend-press": {
    "description": "A standing chest exercise pressing two kettlebells together at the bells, isolating the inner chest.",
    "equipment": "kettlebell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand and press two kettlebells together by squeezing the bells at chest height.",
      "Hold the kettlebells horizontal — bells touching, handles outward.",
      "Press the kettlebells forward to full arm extension.",
      "Pull them back to the chest under control.",
      "Repeat for the prescribed reps."
    ]
  },
  "kettlebell-swing": {
    "description": "An explosive hip-hinge movement using a kettlebell for power and conditioning.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "quadriceps"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart, kettlebell on the floor in front.",
      "Hinge at the hips, grip the kettlebell, and hike it back between your legs.",
      "Explosively drive your hips forward to swing the kettlebell to chest height.",
      "Let the kettlebell swing back between your legs.",
      "Repeat in a fluid motion."
    ]
  },
  "kettlebell-swing-clean": {
    "description": "A hip-driven clean swinging the kettlebell from between the legs up to the shoulder rack position.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "anterior_deltoid",
      "erector_spinae",
      "trapezius"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart, kettlebell between your feet.",
      "Hinge at the hips and grip the handle with one hand.",
      "Swing the kettlebell back between your legs.",
      "Drive your hips forward to pull the kettlebell up to your shoulder.",
      "Catch the kettlebell in the rack position on your shoulder.",
      "Complete reps on one side, then switch."
    ]
  },
  "kettlebell-turkish-get-ups": {
    "description": "A full-body kettlebell exercise that moves from lying to standing while holding the weight locked out overhead, training total-body strength, stability, and mobility.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid",
      "gluteus_maximus",
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques",
      "quadriceps",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on your back holding a kettlebell pressed overhead in one hand.",
      "Bend the knee on the same side and plant the foot flat.",
      "Roll up onto your opposite elbow, then to your hand.",
      "Drive your hips up and sweep your straight leg back into a lunge.",
      "Stand up fully while keeping the kettlebell locked out overhead.",
      "Reverse the sequence to return to the start."
    ]
  },
  "kettlebell-windmills": {
    "description": "A kettlebell exercise hinging sideways under a locked-out overhead weight, training oblique strength and shoulder stability.",
    "equipment": "kettlebell",
    "primary": [
      "adductors",
      "anterior_deltoid",
      "obliques"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_maximus",
      "hamstrings"
    ],
    "instructions": [
      "Stand holding a kettlebell locked out overhead in one hand.",
      "Turn your feet about 45 degrees away from the working arm.",
      "Keeping the kettlebell up, hinge at the hips sideways.",
      "Reach your opposite hand down toward your foot.",
      "Drive your hips back to stand up tall.",
      "Complete reps on one side, then switch."
    ]
  },
  "kettlebell-wrist-curl": {
    "description": "A unilateral wrist curl with a kettlebell, with the offset weight adding extra grip challenge.",
    "equipment": "kettlebell",
    "primary": [
      "forearm_flexors"
    ],
    "secondary": [],
    "instructions": [
      "Sit on a bench with the forearm on the thigh, palm up.",
      "Hold a kettlebell by the handle with the wrist hanging off the knee.",
      "Let the kettlebell rotate down toward the fingertips.",
      "Curl it up by flexing the wrist, controlling the offset weight.",
      "Lower under control. Complete reps per side."
    ]
  },
  "knee-push-ups": {
    "description": "A beginner-friendly push-up variation performed from the knees, reducing bodyweight load while building chest and triceps strength.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "rectus_abdominis",
      "triceps_brachii"
    ],
    "instructions": [
      "Start in a push-up position with your knees on the floor.",
      "Place your hands shoulder-width apart on the ground.",
      "Keep your body in a straight line from knees to shoulders.",
      "Lower your chest toward the floor by bending your elbows.",
      "Press through your hands to return to the starting position.",
      "Repeat for the desired number of reps."
    ]
  },
  "knee-to-chest-stretch": {
    "description": "A lying stretch that releases the glutes and lower back by hugging one knee into the chest.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "erector_spinae"
    ],
    "instructions": [
      "Lie on your back with both legs straight.",
      "Pull one knee in and hug it to your chest with both hands.",
      "Keep the other leg relaxed on the floor.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "kneeling-cable-row": {
    "description": "A cable row performed from a tall kneeling position, eliminating hip drive and keeping tension on the upper back throughout.",
    "equipment": "cable",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Set a cable pulley to about chest height and attach a rope or double-D handle.",
      "Kneel upright facing the stack far enough back that the weight stack doesn't bottom out.",
      "Grab the handle with both hands and hold it out in front at chest height.",
      "Row the handle to the sternum by driving the elbows back and squeezing the shoulder blades together.",
      "Return under control to the stretched starting position.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "kneeling-hip-flexor-stretch": {
    "description": "A half-kneeling stretch that opens the hip flexors of the rear leg by pressing the hips forward.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors"
    ],
    "secondary": [
      "adductors",
      "quadriceps"
    ],
    "instructions": [
      "Kneel on one knee with the other foot flat in front.",
      "Keep your torso upright and core gently braced.",
      "Press your hips forward until the front of the rear hip stretches.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "kneeling-wrist-stretch": {
    "description": "A kneeling stretch for the forearm flexors and wrists, with palms down and fingers pointing back.",
    "equipment": "bodyweight",
    "primary": [
      "forearm_flexors"
    ],
    "secondary": [],
    "instructions": [
      "Kneel on all fours and place your palms flat on the floor.",
      "Turn your hands so the fingers point back toward your knees.",
      "Keep your palms down and rock your weight back gently.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "l-sit": {
    "description": "An advanced static hold with legs extended parallel to the floor, demanding hip flexor and core strength.",
    "equipment": "dip station",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "latissimus_dorsi",
      "quadriceps",
      "triceps_brachii"
    ],
    "instructions": [
      "Sit on the floor or press up on parallel bars with arms straight.",
      "Lock your elbows and depress your shoulders.",
      "Lift your legs straight out in front of you parallel to the floor.",
      "Form an L shape with your body.",
      "Hold the position for the prescribed duration.",
      "Lower your legs with control to exit."
    ]
  },
  "landmine-press": {
    "description": "A two-handed shoulder press using one end of a barbell anchored in a landmine attachment, allowing a natural arc that is easier on the shoulder joint.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid",
      "pectoralis_major"
    ],
    "secondary": [
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Load one end of a barbell into a landmine attachment and load the other end with a plate.",
      "Stand in a staggered or square stance and cup the sleeve end of the barbell in both hands at chest height.",
      "Brace your core and press the bar forward and upward along its natural arc.",
      "Fully extend your arms without locking the elbows, then lower the bar back under control.",
      "Keep both hands on the bar throughout and repeat for the desired number of reps."
    ]
  },
  "lat-pulldown": {
    "description": "A cable machine exercise targeting the latissimus dorsi.",
    "equipment": "cable",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "rhomboids"
    ],
    "instructions": [
      "Sit at the lat pulldown machine with thighs secured under the pads.",
      "Grip the wide bar with an overhand grip.",
      "Pull the bar down to your upper chest, squeezing your lats.",
      "Slowly return the bar to the starting position.",
      "Repeat."
    ]
  },
  "lateral-raise": {
    "description": "An isolation movement targeting the lateral deltoid for shoulder width.",
    "equipment": "dumbbell",
    "primary": [
      "lateral_deltoid"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Stand holding dumbbells at your sides.",
      "Raise the dumbbells out to the sides until arms are parallel to the floor.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "leg-curl": {
    "description": "An isolation exercise for the hamstrings using a leg curl machine.",
    "equipment": "leg curl",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "gastrocnemius"
    ],
    "instructions": [
      "Lie face down on the leg curl machine with ankles under the pad.",
      "Curl your heels toward your glutes.",
      "Squeeze your hamstrings at the top.",
      "Lower with control.",
      "Repeat."
    ]
  },
  "leg-extension": {
    "description": "An isolation exercise for the quadriceps using a machine.",
    "equipment": "leg extension",
    "primary": [
      "quadriceps"
    ],
    "secondary": [],
    "instructions": [
      "Sit in the leg extension machine with ankles behind the pad.",
      "Extend your legs until they are straight.",
      "Squeeze your quads at the top.",
      "Lower with control.",
      "Repeat."
    ]
  },
  "leg-press": {
    "description": "A machine-based compound movement for the quads and glutes.",
    "equipment": "leg press",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Sit in the leg press machine with feet shoulder-width apart on the platform.",
      "Release the safety catches and lower the platform by bending your knees.",
      "Push the platform back up until legs are nearly straight.",
      "Do not lock your knees at the top.",
      "Repeat."
    ]
  },
  "legs-up-the-wall": {
    "description": "A restorative position with the hips close to a wall and the legs resting vertically against it, used for recovery rather than for effort.",
    "equipment": "bodyweight",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae"
    ],
    "instructions": [
      "Sit sideways next to a wall with one hip touching it.",
      "Swing the legs up the wall as you lie back, so the hips end close to the base of the wall.",
      "Let the legs rest against the wall with the feet relaxed and the arms open at the sides.",
      "Stay for the prescribed time, breathing slowly.",
      "Bend the knees and roll to one side to come out."
    ]
  },
  "lizard-stretch": {
    "description": "A deep lunge stretch that opens the hip flexors, groin and glutes with the forearms lowered toward the floor.",
    "equipment": "bodyweight",
    "primary": [
      "adductors",
      "hip_flexors"
    ],
    "secondary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "instructions": [
      "Step one foot forward into a deep lunge, foot placed wide.",
      "Lower both forearms toward the floor inside the front foot.",
      "Extend the back leg straight and let the hips sink.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "locust-pose": {
    "description": "A prone hold in which the chest, arms and legs lift away from the floor, so the whole back line works isometrically without any load.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings",
      "posterior_deltoid"
    ],
    "instructions": [
      "Lie face down with the arms alongside the body and the forehead on the mat.",
      "Lengthen the back of the neck and reach the fingertips towards the feet.",
      "Lift the chest, arms and both legs off the floor at the same time.",
      "Hold the lifted position for the prescribed time, keeping the gaze down.",
      "Lower everything down together and rest."
    ]
  },
  "low-lunge": {
    "description": "A kneeling split-stance stretch: the back knee rests on the floor while the hips sink forward, lengthening the hip flexor of the rear leg.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_maximus"
    ],
    "instructions": [
      "From kneeling, step one foot forward so the knee stacks over the ankle.",
      "Lower the back knee to the floor and untuck that foot.",
      "Tuck the tailbone slightly and press the hips forward until you feel the front of the back thigh lengthen.",
      "Lift the chest, raise the arms if it feels good, and hold for the prescribed time.",
      "Step back and repeat on the other side."
    ]
  },
  "low-lunge-to-half-split": {
    "description": "A moving hamstring and hip-flexor sequence: from a low lunge the hips shift back over the rear knee and the front leg straightens into a half split, then the hips travel forward into the lunge again.",
    "equipment": "bodyweight",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "gastrocnemius",
      "hip_flexors"
    ],
    "instructions": [
      "Start in a low lunge with the back knee on the floor and the front knee over the ankle.",
      "Press the hands into the floor or onto blocks either side of the front foot.",
      "Shift the hips back over the back knee and straighten the front leg, flexing that foot.",
      "Hold the half split briefly, then glide the hips forward into the low lunge again.",
      "Repeat for the desired number of repetitions and change sides."
    ]
  },
  "lunge": {
    "description": "A bodyweight forward lunge stepping into a long stride, training the quads, glutes, and balance one leg at a time.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand tall with your feet hip-width apart.",
      "Step forward with one leg into a long stride.",
      "Lower your back knee toward the floor until both knees form 90-degree angles.",
      "Drive through your front heel to return to standing.",
      "Complete reps on one side, then switch."
    ]
  },
  "lying-leg-raise": {
    "description": "A floor-based core exercise that targets the lower abs and hip flexors by raising straight legs from a supine position.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques",
      "transverse_abdominis"
    ],
    "instructions": [
      "Lie flat on your back with legs straight and hands under your lower back or gripping a stable surface behind your head.",
      "Keeping your legs together and core braced, raise them to vertical (or as high as flexibility allows).",
      "Pause briefly at the top.",
      "Lower your legs slowly toward the floor without letting them touch.",
      "Repeat for the desired reps."
    ]
  },
  "lying-tricep-extension": {
    "description": "A lying isolation exercise lowering the weight toward the forehead and extending the elbows to work the triceps.",
    "equipment": "dumbbell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Lie flat on a bench with a barbell or dumbbells held overhead.",
      "Keep your upper arms vertical and elbows pointed forward.",
      "Lower the weight toward your forehead by bending your elbows.",
      "Extend your arms back to the starting position.",
      "Squeeze your triceps at the top.",
      "Repeat for the desired number of reps."
    ]
  },
  "machine-back-extension": {
    "description": "A seated machine isolation exercise for the lower back: with the hips and legs held in place, the torso is driven backwards against a padded lever to extend the spine against a weight stack.",
    "equipment": "back extension machine",
    "primary": [
      "erector_spinae"
    ],
    "secondary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "instructions": [
      "Sit in the back extension machine with your feet flat on the foot platform and the roller pad set behind your upper back, just below the shoulder blades.",
      "Grip the handles at your sides and let your torso come forward into a slight flexion — this is the starting position.",
      "Push back against the pad by extending your spine until your torso is leaning back and your lower back is fully contracted.",
      "Pause briefly at full extension, then return to the starting position under control, resisting the weight stack on the way back.",
      "Repeat for the desired number of reps."
    ]
  },
  "machine-bicep-curl": {
    "description": "A machine-based bicep curl for isolated arm training.",
    "equipment": "bicep curl machine",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis"
    ],
    "instructions": [
      "Sit in the machine and adjust the pad to your arm length.",
      "Grip the handles with an underhand grip.",
      "Curl the handles toward your shoulders.",
      "Lower with control.",
      "Repeat."
    ]
  },
  "machine-calf-raise": {
    "description": "A standing machine exercise isolating the calves through a full stretch and rise onto the toes.",
    "equipment": "standing calf raise machine",
    "primary": [
      "gastrocnemius",
      "soleus"
    ],
    "secondary": [],
    "instructions": [
      "Stand in the calf raise machine with the balls of your feet on the platform.",
      "Position the shoulder pads firmly.",
      "Lower your heels below the platform for a full stretch.",
      "Push through the balls of your feet to rise onto your toes.",
      "Squeeze your calves at the top.",
      "Lower with control and repeat."
    ]
  },
  "machine-chest-fly": {
    "description": "A chest isolation exercise performed on a machine that arcs the handles together in front of the body.",
    "equipment": "chest fly machine",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "serratus_anterior"
    ],
    "instructions": [
      "Sit in the chest fly machine and adjust the seat so the handles align with your chest.",
      "Grip the handles with a slight bend in your elbows.",
      "Bring the handles together in front of your chest in a smooth arc.",
      "Squeeze your pectorals at the point of peak contraction.",
      "Return under control to the starting position without slamming the weight.",
      "Repeat for the desired number of reps."
    ]
  },
  "machine-preacher-curl": {
    "description": "A preacher curl performed on a plate-loaded or selectorized machine, locking the elbows on a pad and providing a fixed strength curve.",
    "equipment": "preacher curl machine",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis"
    ],
    "instructions": [
      "Sit at a preacher curl machine and adjust the seat so your armpits sit at the top of the pad.",
      "Place the upper arms flat on the pad and grip the handles.",
      "Start with the arms extended — but not locked — at the bottom.",
      "Curl the handles up by flexing the elbows; squeeze hard at the top.",
      "Lower slowly back to the starting position and repeat."
    ]
  },
  "machine-seated-crunch": {
    "description": "An abdominal isolation exercise performed on a seated machine that flexes the spine against resistance.",
    "equipment": "ab crunch machine",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques",
      "transverse_abdominis"
    ],
    "instructions": [
      "Sit in the abdominal crunch machine and grip the handles.",
      "Position the chest pad against your upper body.",
      "Contract your abs to crunch your torso forward and down.",
      "Squeeze at the bottom of the movement.",
      "Return to the starting position with control.",
      "Repeat for the desired number of reps."
    ]
  },
  "machine-shoulder-press": {
    "description": "A machine-based overhead pressing movement for the shoulders.",
    "equipment": "shoulder press machine",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Sit in the machine with your back against the pad.",
      "Grip the handles at shoulder level.",
      "Press the handles overhead until arms are fully extended.",
      "Lower with control to the starting position.",
      "Repeat."
    ]
  },
  "machine-triceps-extension": {
    "description": "A seated machine isolation exercise in which the upper arms stay supported on a pad while the elbows extend against two handles, loading the triceps along a fixed path without help from the shoulders or torso.",
    "equipment": "tricep extension machine",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Sit in the tricep extension machine with your back against the seat pad and your upper arms resting flat on the arm pad in front of your chest.",
      "Take a handle in each hand with your elbows bent and your hands up near shoulder height.",
      "Keeping your upper arms pressed into the pad, extend your elbows to drive the handles down and away until your arms are straight.",
      "Squeeze your triceps at full extension, then bend your elbows to return to the start under control.",
      "Repeat for the desired number of reps."
    ]
  },
  "medicine-ball-slam": {
    "description": "An explosive full-body exercise where a soft slam ball is lifted overhead and driven into the floor with maximum force.",
    "equipment": "slam ball",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "gluteus_maximus",
      "latissimus_dorsi",
      "obliques"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart, holding a slam ball in front of your hips.",
      "Lift the ball overhead by extending the hips and reaching tall.",
      "Forcefully slam the ball into the floor between your feet, crunching through the core.",
      "Catch the ball on the bounce or pick it up from the floor.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "mountain-climbers": {
    "description": "A dynamic bodyweight exercise combining core work with cardio.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques",
      "quadriceps"
    ],
    "instructions": [
      "Start in a high plank position.",
      "Drive one knee toward your chest.",
      "Quickly switch legs, driving the other knee forward.",
      "Continue alternating at a brisk pace.",
      "Repeat."
    ]
  },
  "mountain-pose": {
    "description": "The basic standing posture: feet grounded, legs active, spine tall and shoulders relaxed. It is the reference alignment every other standing pose is measured against.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae"
    ],
    "secondary": [
      "gastrocnemius",
      "quadriceps"
    ],
    "instructions": [
      "Stand with the feet hip-width apart and spread the weight evenly across both feet.",
      "Engage the thighs lightly and let the tailbone drop so the pelvis is neutral.",
      "Stack the ribs over the pelvis and the head over the ribs, arms relaxed by the sides.",
      "Hold the posture for the prescribed time, breathing evenly.",
      "Notice where the weight sits and rebalance it towards the middle of each foot."
    ]
  },
  "muscle-snatch": {
    "description": "A snatch variation pulling the barbell overhead without dropping under it, building pulling power and lockout strength.",
    "equipment": "barbell",
    "primary": [
      "lateral_deltoid",
      "trapezius"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_maximus",
      "hamstrings"
    ],
    "instructions": [
      "Stand with feet hip-width apart and grip the bar wide with a hook grip.",
      "Pull the bar explosively from the floor, keeping it close to your body.",
      "Shrug hard and pull the bar overhead without dipping under.",
      "Lock out the bar overhead with straight arms.",
      "Lower the bar under control to the starting position.",
      "Repeat for the desired number of reps."
    ]
  },
  "muscle-ups": {
    "description": "An advanced bar movement combining an explosive pull-up with a dip transition to finish above the bar.",
    "equipment": "pull up bar",
    "primary": [
      "latissimus_dorsi",
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "biceps_brachii",
      "pectoralis_major"
    ],
    "instructions": [
      "Hang from a pull-up bar with a false grip.",
      "Pull yourself up explosively toward the bar.",
      "As your chest reaches the bar, rotate your elbows over and transition into a dip.",
      "Press your body up until your arms are fully extended above the bar.",
      "Lower back down with control through the same path.",
      "Repeat for the desired number of reps."
    ]
  },
  "neck-side-stretch": {
    "description": "A gentle stretch that lengthens the upper trapezius and side of the neck by tilting the ear toward the shoulder.",
    "equipment": "bodyweight",
    "primary": [
      "trapezius"
    ],
    "secondary": [],
    "instructions": [
      "Sit or stand tall with your shoulders relaxed.",
      "Tilt your head so one ear drops toward that shoulder.",
      "Rest that hand lightly over your head for gentle weight.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "negative-pull-ups": {
    "description": "A pull-up regression emphasizing the slow lowering phase, building back and grip strength toward a full pull-up.",
    "equipment": "pull up bar",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "forearm_flexors",
      "posterior_deltoid",
      "rhomboids"
    ],
    "instructions": [
      "Use a box or jump to position yourself at the top of a pull-up.",
      "Grip the bar with hands shoulder-width apart.",
      "Hold your chin above the bar briefly.",
      "Lower yourself slowly over 3-5 seconds with control.",
      "Fully extend your arms at the bottom.",
      "Reset and repeat for the desired number of reps."
    ]
  },
  "neutral-grip-pull-ups": {
    "description": "A pull-up variation on parallel handles with palms facing each other, recruiting the lats with strong brachialis assistance.",
    "equipment": "pull up bar",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "brachialis",
      "forearm_flexors",
      "rhomboids"
    ],
    "instructions": [
      "Grip parallel bars with palms facing each other.",
      "Hang with your arms fully extended.",
      "Pull yourself up until your chin clears the bar.",
      "Squeeze your lats at the top of the movement.",
      "Lower yourself with control to the starting position.",
      "Repeat for the desired number of reps."
    ]
  },
  "nordic-hamstring-curl": {
    "description": "A knee-flexion exercise lowering the torso forward from a kneeling position, working the hamstrings eccentrically.",
    "equipment": "glute ham developer",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "gastrocnemius",
      "gluteus_maximus"
    ],
    "instructions": [
      "Kneel on a pad with your ankles anchored under a fixed support.",
      "Keep your torso upright and your hips extended.",
      "Slowly lower your body forward by resisting with your hamstrings.",
      "Catch yourself with your hands just before hitting the floor.",
      "Push back up and pull yourself to the starting position.",
      "Repeat for the desired number of reps."
    ]
  },
  "ohp": {
    "description": "A compound overhead pressing movement targeting the shoulders and triceps.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart, bar at collarbone level.",
      "Brace your core and press the bar overhead.",
      "Lock out at the top with the bar over your mid-foot.",
      "Lower the bar back to collarbone height.",
      "Repeat."
    ]
  },
  "one-arm-dumbbell-push-press": {
    "description": "A unilateral push press using a single dumbbell. Leg drive lets you punch heavier loads overhead than a strict one-arm press, and the asymmetric load forces strong anti-lateral-flexion bracing.",
    "equipment": "dumbbell",
    "primary": [
      "anterior_deltoid"
    ],
    "secondary": [
      "gluteus_maximus",
      "lateral_deltoid",
      "obliques",
      "quadriceps",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand holding a dumbbell at one shoulder, palm facing inward (neutral).",
      "Feet shoulder-width, core braced, free arm out to the side for balance.",
      "Dip by bending the knees slightly, keeping the torso vertical.",
      "Explosively extend the legs and press the dumbbell overhead in one motion.",
      "Lock out overhead, then lower back to the shoulder under control.",
      "Complete all reps on one side, then switch."
    ]
  },
  "one-arm-dumbbell-swing": {
    "description": "This dynamic exercise builds explosive power in the glutes and hamstrings through a powerful hip hinge, engaging the core and shoulders for a full-body workout.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "forearm_flexors",
      "lateral_deltoid"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart, a dumbbell on the floor slightly in front of you.",
      "Hinge at your hips, keeping a flat back, and grasp the dumbbell with one hand.",
      "Hike the dumbbell back between your legs, then explosively drive your hips forward.",
      "Swing the dumbbell up to chest height, keeping your arm relaxed and straight.",
      "Allow the dumbbell to swing back down, hinging at the hips as it descends.",
      "Repeat for desired reps per side, maintaining control."
    ]
  },
  "one-arm-kettlebell-bicep-curl": {
    "description": "A unilateral kettlebell exercise isolating the biceps, with the offset load adding forearm and grip demand.",
    "equipment": "kettlebell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis",
      "forearm_flexors"
    ],
    "instructions": [
      "Stand tall holding a kettlebell in one hand.",
      "Keep your elbow pinned to your side.",
      "Curl the kettlebell toward your shoulder by flexing your bicep.",
      "Squeeze at the top of the movement.",
      "Lower the kettlebell with control.",
      "Complete reps on one side, then switch."
    ]
  },
  "one-arm-kettlebell-bottoms-up-press": {
    "description": "A strict overhead press with the kettlebell held upside-down — bell on top, handle at the palm. The inverted load demands heavy grip, perfect shoulder stability, and ruthless bar-path discipline.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid"
    ],
    "secondary": [
      "forearm_flexors",
      "lateral_deltoid",
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Clean a light kettlebell to the rack position, then tilt it so the bell points up and the handle is at the palm.",
      "Grip the handle hard; wrist absolutely straight and vertical.",
      "Brace the core and press the bell straight up without letting it tip.",
      "Lock out overhead with the bell still perfectly upright.",
      "Lower slowly back to the rack position keeping the bell vertical the entire descent.",
      "Complete all reps on one side, then switch."
    ]
  },
  "one-arm-kettlebell-floor-glute-bridge-press": {
    "description": "A combined glute bridge and single-arm floor press, training the glutes and chest in one movement.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "hamstrings",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on your back with knees bent and feet flat on the floor.",
      "Hold a kettlebell in one hand at your shoulder.",
      "Drive your hips up into a glute bridge.",
      "Press the kettlebell straight up toward the ceiling.",
      "Lower the kettlebell and your hips with control.",
      "Complete reps on one side, then switch."
    ]
  },
  "one-arm-kettlebell-floor-press": {
    "description": "A unilateral kettlebell press performed lying on the floor, where the limited range reduces shoulder strain.",
    "equipment": "kettlebell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie flat on the floor with knees bent.",
      "Hold a kettlebell at your shoulder with one hand.",
      "Press the kettlebell straight up until your arm is fully extended.",
      "Lower the kettlebell until your upper arm touches the floor.",
      "Keep your core braced throughout.",
      "Complete reps on one side, then switch."
    ]
  },
  "one-arm-kettlebell-front-squat": {
    "description": "A unilateral front squat with one kettlebell racked at the shoulder, challenging the legs and core against the offset load.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings",
      "obliques"
    ],
    "instructions": [
      "Hold a kettlebell in the racked position at one shoulder.",
      "Stand with feet shoulder-width apart.",
      "Squat down by bending your knees and hips.",
      "Keep your chest up and torso upright throughout.",
      "Drive through your heels to stand back up.",
      "Complete reps on one side, then switch."
    ]
  },
  "one-arm-kettlebell-push-press": {
    "description": "An explosive single-arm overhead press using leg drive to launch the kettlebell, allowing heavier loads than a strict press.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid"
    ],
    "secondary": [
      "gluteus_maximus",
      "quadriceps",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Hold a kettlebell in the racked position at one shoulder.",
      "Stand with feet shoulder-width apart.",
      "Dip by bending your knees slightly.",
      "Drive explosively through your legs and press the kettlebell overhead.",
      "Lock out your arm at the top.",
      "Lower the kettlebell to your shoulder with control.",
      "Complete reps on one side, then switch."
    ]
  },
  "one-arm-kettlebell-row": {
    "description": "A unilateral rowing exercise with bench support, building the lats and mid-back one side at a time.",
    "equipment": "kettlebell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Place one hand and knee on a bench for support.",
      "Hold a kettlebell in the opposite hand with your arm extended.",
      "Pull the kettlebell toward your hip by driving your elbow back.",
      "Squeeze your back at the top of the movement.",
      "Lower the kettlebell with control.",
      "Complete reps on one side, then switch."
    ]
  },
  "one-arm-kettlebell-shoulder-press": {
    "description": "A strict single-arm overhead press from the rack position, training the shoulders while the core resists side-bending.",
    "equipment": "kettlebell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "obliques",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Hold a kettlebell in the racked position at one shoulder.",
      "Stand tall with feet hip-width apart.",
      "Press the kettlebell straight overhead until your arm is locked out.",
      "Keep your core tight throughout.",
      "Lower the kettlebell back to the rack position with control.",
      "Complete reps on one side, then switch."
    ]
  },
  "one-arm-kettlebell-swing": {
    "description": "A single-arm variation of the kettlebell swing, adding grip and anti-rotation demands to the explosive hip hinge.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "anterior_deltoid",
      "erector_spinae",
      "obliques"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart and a kettlebell on the floor in front of you.",
      "Hinge at the hips and grip the kettlebell with one hand.",
      "Hike the kettlebell back between your legs.",
      "Drive your hips forward to swing the kettlebell to chest height.",
      "Let gravity bring the kettlebell back between your legs.",
      "Complete reps on one side, then switch."
    ]
  },
  "one-arm-kettlebell-tricep-kickback": {
    "description": "A unilateral tricep isolation done with a kettlebell instead of a dumbbell. Hinge over, pin the upper arm to the side parallel to the floor, and extend the elbow back. The offset bell mass adds rotational tension at the bottom of every rep.",
    "equipment": "kettlebell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "posterior_deltoid"
    ],
    "instructions": [
      "Hinge forward at the hips with a flat back, knees softly bent.",
      "Hold a kettlebell by the handle in one hand, palm facing the body.",
      "Pin the upper arm to the side so it is parallel to the floor; the forearm hangs straight down.",
      "Extend the elbow back to straighten the arm fully behind you, keeping the upper arm motionless.",
      "Squeeze the tricep at lockout, then return under control to the starting position.",
      "Complete all reps on one side, then switch hands."
    ]
  },
  "one-arm-landmine-press": {
    "description": "A unilateral overhead press variation using a landmine setup that follows a natural arc, reducing shoulder impingement risk while building pressing strength.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid",
      "pectoralis_major"
    ],
    "secondary": [
      "obliques",
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Anchor one end of a barbell in a landmine attachment and load the free end.",
      "Kneel on one knee or stand and grip the sleeve end at shoulder height with one hand.",
      "Press the bar upward and forward along its arc until the arm is fully extended.",
      "Lower the bar back to shoulder height under control.",
      "Complete all reps before switching sides."
    ]
  },
  "one-arm-lat-pulldown": {
    "description": "A unilateral cable pulldown that targets the latissimus dorsi with a single-arm handle, allowing a greater range of motion and bilateral strength imbalances to be addressed.",
    "equipment": "cable",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "rhomboids"
    ],
    "instructions": [
      "Attach a single-handle to the cable pulldown station and sit with your thighs secured under the pad.",
      "Reach up and grasp the handle with one hand, arm fully extended.",
      "Pull the handle down toward your shoulder, driving your elbow toward your hip.",
      "Pause briefly at full contraction, then return to the starting position with control.",
      "Complete all reps on one side before switching."
    ]
  },
  "one-arm-single-leg-dumbbell-romanian-deadlift": {
    "description": "A single-leg RDL holding a dumbbell in one hand — usually the hand opposite the working leg (contralateral). Loads the hamstrings and glutes of the standing leg while demanding heavy anti-rotation from the core.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "forearm_flexors",
      "gluteus_medius",
      "obliques"
    ],
    "instructions": [
      "Stand on one leg holding a dumbbell in the opposite hand.",
      "Free arm out to the side for balance, free leg hovering just off the floor.",
      "Hinge at the standing hip, pushing it back while the free leg extends behind to counterbalance.",
      "Keep the hips square to the floor — do not open them to the side.",
      "Lower the dumbbell toward the foot of the standing leg, feeling a deep hamstring stretch.",
      "Drive the hip forward to return to standing under control.",
      "Complete all reps on one side, then switch."
    ]
  },
  "one-arm-single-leg-kettlebell-romanian-deadlift": {
    "description": "The kettlebell version of the one-arm single-leg RDL. The offset mass of the kettlebell and the lower hanging centre make this a subtly different challenge to the dumbbell variant — excellent for posterior-chain strength and balance under asymmetric load.",
    "equipment": "kettlebell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "forearm_flexors",
      "gluteus_medius",
      "obliques"
    ],
    "instructions": [
      "Stand on one leg holding a kettlebell in the opposite hand by the handle.",
      "Free arm out to the side for balance, free leg hovering behind.",
      "Hinge at the standing hip, pushing it back while the free leg extends to counterbalance.",
      "Keep hips square to the floor; the kettlebell tracks straight down the shin.",
      "Feel a deep hamstring stretch on the standing leg at the bottom.",
      "Drive the hip forward to return to standing.",
      "Complete all reps on one side, then switch."
    ]
  },
  "overhead-squat": {
    "description": "A squat with a barbell locked out overhead in a wide snatch grip, demanding mobility, stability, and a strong core.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "lateral_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Hold a barbell overhead with a wide snatch grip and arms locked out.",
      "Stand with feet slightly wider than shoulder-width.",
      "Squat down by pushing your hips back and bending your knees.",
      "Keep the bar directly over the middle of your feet.",
      "Drive through your heels to stand back up.",
      "Repeat for the desired number of reps."
    ]
  },
  "overhead-tricep-extension": {
    "description": "An isolation exercise for the triceps emphasizing the long head.",
    "equipment": "dumbbell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Stand or sit holding a dumbbell overhead with both hands.",
      "Lower the dumbbell behind your head by bending your elbows.",
      "Extend your arms back to the starting position.",
      "Keep your elbows close to your head throughout.",
      "Repeat."
    ]
  },
  "overhead-triceps-stretch": {
    "description": "A standing stretch that lengthens the triceps and lat by reaching the hand down the upper back.",
    "equipment": "bodyweight",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "latissimus_dorsi"
    ],
    "instructions": [
      "Raise one arm overhead and bend the elbow.",
      "Let your hand drop down behind your head.",
      "Use the other hand to press the bent elbow back.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "pause-deadlift": {
    "description": "A deadlift variation with a deliberate pause just below the knees to build strength off the floor.",
    "equipment": "barbell",
    "primary": [
      "erector_spinae",
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "quadriceps",
      "trapezius"
    ],
    "instructions": [
      "Set up for a conventional deadlift.",
      "Pull the bar off the floor and pause when it passes your knees.",
      "Hold for 2–3 seconds, then complete the lift.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "pause-pull-up": {
    "description": "A pull-up variation that adds a brief isometric hold at the top of the movement, with the chin over the bar, before lowering back down.",
    "equipment": "pull up bar",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Hang from a pull-up bar with an overhand grip, arms fully extended.",
      "Pull yourself up until your chin clears the bar.",
      "Pause and hold that top position for a moment.",
      "Lower yourself back down under control to a full hang.",
      "Repeat for the desired number of reps."
    ]
  },
  "pause-squat": {
    "description": "A barbell squat variation with a deliberate pause at the bottom, eliminating the stretch reflex to build strength from a dead stop.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Unrack a barbell and rest it across your upper back.",
      "Stand with feet shoulder-width apart.",
      "Squat down until your thighs are parallel to the floor.",
      "Hold the bottom position for 2-3 seconds.",
      "Drive through your heels to stand back up.",
      "Repeat for the desired number of reps."
    ]
  },
  "paused-bench-press": {
    "description": "A bench press variation pausing the bar on the chest, removing momentum to build strict pressing strength.",
    "equipment": "barbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on a flat bench and grip the barbell slightly wider than shoulder-width.",
      "Unrack the bar and lower it to your chest.",
      "Pause on your chest for 1-2 seconds.",
      "Press the bar back up until your arms are fully extended.",
      "Control the descent on every rep.",
      "Repeat for the desired number of reps."
    ]
  },
  "paused-incline-bench-press": {
    "description": "An incline bench press with a pause on the upper chest, emphasizing strict control and upper-pec strength.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid",
      "pectoralis_major"
    ],
    "secondary": [
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on an incline bench and grip the barbell slightly wider than shoulder-width.",
      "Unrack the bar and lower it to your upper chest.",
      "Pause on your chest for 1-2 seconds.",
      "Press the bar back up until your arms are fully extended.",
      "Keep your shoulder blades retracted throughout.",
      "Repeat for the desired number of reps."
    ]
  },
  "paused-ohp": {
    "description": "An overhead press variation that pauses the bar at the shoulders, removing momentum to build strict pressing strength and overhead stability.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Set up with a barbell racked at shoulder height, feet shoulder-width apart, and the core braced.",
      "Press the bar straight overhead until the elbows are fully locked out.",
      "Lower the bar under control back down to the front of the shoulders.",
      "Hold a full one-second pause at the shoulders, keeping tension and eliminating any bounce.",
      "Press back up from the dead stop without using leg drive."
    ]
  },
  "pec-deck": {
    "description": "A chest isolation machine with fixed elbow pads that targets the pectorals through horizontal adduction.",
    "equipment": "pec deck",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "serratus_anterior"
    ],
    "instructions": [
      "Sit in the pec deck machine and place your forearms against the pads.",
      "Adjust the seat so pads align with mid-chest height.",
      "Squeeze the pads together in front of your chest.",
      "Hold the contraction briefly at the center.",
      "Return under control to the starting position.",
      "Repeat for the desired number of reps."
    ]
  },
  "pendlay-row": {
    "description": "A strict barbell row performed from a dead stop on the floor between reps, torso parallel to the ground. Popularized by coach Glenn Pendlay.",
    "equipment": "barbell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids",
      "trapezius"
    ],
    "secondary": [
      "biceps_brachii",
      "erector_spinae",
      "posterior_deltoid"
    ],
    "instructions": [
      "Load a barbell and set it on the floor.",
      "Hinge at the hips until your torso is parallel to the ground, knees slightly bent.",
      "Grip the bar slightly wider than shoulder-width with an overhand grip.",
      "Explosively pull the bar to your lower chest.",
      "Lower the bar back to the floor under control and pause before the next rep.",
      "Repeat."
    ]
  },
  "pigeon-stretch": {
    "description": "A seated floor stretch that targets the glutes and outer hip with the front shin folded across the body.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "gluteus_medius",
      "hip_flexors"
    ],
    "instructions": [
      "From all fours, bring one knee forward and lay the shin across in front.",
      "Extend the other leg straight back, top of the foot down.",
      "Sink your hips toward the floor and keep them square.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "pike-push-ups": {
    "description": "A push-up performed with hips high in a pike position, pressing at a steep angle to load the shoulders.",
    "equipment": "bodyweight",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Start in a downward dog position with hips high and hands shoulder-width apart.",
      "Walk your feet closer to your hands.",
      "Bend your elbows and lower your head toward the floor.",
      "Keep your hips high throughout.",
      "Press back up until your arms are fully extended.",
      "Repeat for the desired number of reps."
    ]
  },
  "pilates-kneeling-side-kick": {
    "description": "A classical mat exercise: kneeling on one knee with the hand on the floor for support, the top leg swings forward and back at hip height while the trunk holds still.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_medius",
      "obliques"
    ],
    "secondary": [
      "gluteus_maximus",
      "hip_flexors"
    ],
    "instructions": [
      "Kneel on one knee and place the same-side hand on the floor, the other hand behind the head.",
      "Extend the top leg out to the side at hip height with the foot flexed.",
      "Keep the trunk perfectly still and swing the leg forward as far as the pelvis stays square.",
      "Swing the leg back behind the line of the body without arching the lower back.",
      "Repeat for the desired number of repetitions and change sides."
    ]
  },
  "pilates-leg-pull-back": {
    "description": "A reverse plank with alternating leg lifts: the hips stay high while one leg at a time is raised, so the glutes and the back of the trunk work against the shifting support.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings",
      "posterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Sit with the legs straight and the hands on the floor behind the hips, fingers pointing forward.",
      "Press into the hands and heels and lift the hips into a reverse plank.",
      "Keeping the hips level and high, lift one straight leg as far as the pelvis stays still.",
      "Lower the leg under control and repeat with the other one.",
      "Finish the set and lower the hips to the floor."
    ]
  },
  "pilates-leg-pull-front": {
    "description": "A high plank with alternating leg lifts: the shoulders stay stacked over the wrists while one leg at a time lifts, adding an anti-rotation demand to the plank.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "rectus_abdominis"
    ],
    "secondary": [
      "anterior_deltoid",
      "erector_spinae",
      "transverse_abdominis"
    ],
    "instructions": [
      "Set up in a high plank with the hands under the shoulders and the body in one line.",
      "Brace the trunk and squeeze the glutes so the hips cannot rotate.",
      "Lift one straight leg a few centimetres above hip height without letting the pelvis tilt.",
      "Lower it under control and repeat with the other leg.",
      "Keep alternating for the desired number of repetitions."
    ]
  },
  "pilates-roll-down": {
    "description": "A standing articulation of the spine: the head leads a vertebra-by-vertebra roll towards the floor and back up, mobilising the whole back while the legs stay steady.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae"
    ],
    "secondary": [
      "hamstrings",
      "rectus_abdominis"
    ],
    "instructions": [
      "Stand tall with the feet hip-width apart and the arms hanging at the sides.",
      "Drop the chin to the chest and start rolling down one vertebra at a time.",
      "Let the arms and head hang heavy once the spine is fully rolled down.",
      "Roll back up the same way, stacking the vertebrae one by one, head last.",
      "Repeat for the desired number of repetitions."
    ]
  },
  "pilates-roll-over": {
    "description": "A controlled inversion from the mat: with the arms pressing down, the straight legs travel overhead until the toes reach towards the floor, then the spine rolls back down one segment at a time.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis",
      "transverse_abdominis"
    ],
    "secondary": [
      "erector_spinae",
      "hip_flexors"
    ],
    "instructions": [
      "Lie on your back with the legs straight and the arms pressed into the mat beside you.",
      "Lift both legs to vertical without letting the lower back arch.",
      "Press the arms down and take the legs overhead until they are parallel to the floor behind you.",
      "Open the legs slightly, flex the feet, and roll the spine down one vertebra at a time.",
      "Return the legs to vertical and repeat for the desired number of repetitions."
    ]
  },
  "pilates-saw": {
    "description": "A seated twist and reach: sitting tall with the legs wide, the torso rotates and then folds over the opposite leg so the reaching hand passes the little toe like a saw.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "obliques"
    ],
    "secondary": [
      "adductors",
      "hamstrings"
    ],
    "instructions": [
      "Sit tall with the legs straight and slightly wider than the hips, arms out to the sides.",
      "Rotate the torso to one side, keeping both sit bones on the floor.",
      "Fold forward over that leg and reach the opposite hand past the little toe.",
      "Roll back up through the spine and return to the centre.",
      "Repeat to the other side and continue alternating."
    ]
  },
  "pilates-side-bend": {
    "description": "A lateral trunk exercise from a side-supported position: the hips lift and the top arm reaches overhead, bending the body sideways over the supporting arm.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_medius",
      "obliques"
    ],
    "secondary": [
      "anterior_deltoid",
      "transverse_abdominis"
    ],
    "instructions": [
      "Sit on one hip with the legs bent to the side and the supporting hand on the floor under the shoulder.",
      "Press into the hand and the lower leg to lift the hips off the floor.",
      "Reach the top arm overhead so the body forms a long arc from the hand to the feet.",
      "Lower the hips under control back towards the mat.",
      "Complete the repetitions and change sides."
    ]
  },
  "pilates-spine-stretch-forward": {
    "description": "A seated articulation: sitting tall with the legs apart, the spine curls forward segment by segment over the legs and then restacks vertebra by vertebra.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "rectus_abdominis"
    ],
    "secondary": [
      "hamstrings",
      "transverse_abdominis"
    ],
    "instructions": [
      "Sit tall with the legs straight and slightly wider than the hips, feet flexed.",
      "Reach the arms forward at shoulder height.",
      "Drop the chin and curl the spine forward one vertebra at a time, reaching past the toes.",
      "Restack the spine from the base upwards until you are sitting tall again.",
      "Repeat for the desired number of repetitions."
    ]
  },
  "pilates-spine-twist": {
    "description": "A seated rotation with the legs together and the arms wide: the trunk turns to each side in a controlled pulse while the pelvis and legs stay completely still.",
    "equipment": "bodyweight",
    "primary": [
      "obliques"
    ],
    "secondary": [
      "erector_spinae",
      "transverse_abdominis"
    ],
    "instructions": [
      "Sit tall with the legs straight and together, feet flexed, arms out to the sides at shoulder height.",
      "Grow tall through the spine and press both sit bones into the floor.",
      "Rotate the trunk to one side as far as the hips stay square, then return to the centre.",
      "Rotate to the other side in the same way.",
      "Keep alternating for the desired number of repetitions."
    ]
  },
  "pistol-squat": {
    "description": "A single-leg squat performed with the non-working leg extended forward, demanding strength and balance.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings",
      "hip_flexors"
    ],
    "instructions": [
      "Stand on one leg with the other extended forward, arms out for balance.",
      "Hinge at the hips and bend the standing knee, keeping the chest up.",
      "Descend slowly until the back of the thigh touches the calf.",
      "Drive through the standing heel to return to standing.",
      "Complete reps per side, then switch legs."
    ]
  },
  "planche": {
    "description": "An advanced calisthenics hold requiring exceptional upper body and core strength to hold the body parallel to the ground.",
    "equipment": "bodyweight",
    "primary": [
      "anterior_deltoid",
      "pectoralis_major"
    ],
    "secondary": [
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Begin in a push-up position with hands turned outward.",
      "Lean forward until your center of mass is over your hands.",
      "Lift your feet off the ground keeping the body horizontal.",
      "Hold the position.",
      "Return to the floor with control."
    ]
  },
  "plank": {
    "description": "An isometric core exercise that strengthens the entire midsection.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis",
      "transverse_abdominis"
    ],
    "secondary": [
      "erector_spinae"
    ],
    "instructions": [
      "Place your forearms on the floor with elbows under your shoulders.",
      "Extend your legs back and rise onto your toes.",
      "Keep your body in a straight line from head to heels.",
      "Brace your core and squeeze your glutes.",
      "Hold the position for the desired duration.",
      "Lower your knees to exit the hold."
    ]
  },
  "plate-loaded-donkey-calf-raise": {
    "description": "A donkey calf raise on a plate-loaded machine, with a pad across the hips and the torso hinged forward so the calves are stretched at the bottom of every repetition.",
    "equipment": "donkey calf raise machine",
    "primary": [
      "gastrocnemius"
    ],
    "secondary": [
      "soleus"
    ],
    "instructions": [
      "Load the plate horns and step onto the platform with the balls of your feet on the edge and your heels hanging free.",
      "Bend forward at the hips and settle the pad across your hips, then rest your forearms on the support in front of you.",
      "Keep your knees straight and your back flat, with your torso close to parallel to the floor.",
      "Push through the balls of your feet and raise your heels as high as you can, pausing briefly at the top.",
      "Lower your heels below the platform until you feel a strong calf stretch, and repeat for the desired number of repetitions."
    ]
  },
  "plate-loaded-glute-drive": {
    "description": "A machine hip thrust performed on a plate-loaded glute drive, where the built-in back pad and foot platform set the position so the hips can extend against the load without setting up a bench.",
    "equipment": "hip thrust machine",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings",
      "quadriceps"
    ],
    "instructions": [
      "Load the plate horns evenly and sit into the machine with your upper back against the pad and your feet flat on the platform.",
      "Pull the hip pad or lap bar across your hips and adjust it so it sits on the crease of the hips, not on your stomach.",
      "Set your feet so that your shins will be roughly vertical when your hips are at the top, and take hold of the handles.",
      "Drive your hips up by squeezing the glutes until your thighs are level with your torso, and hold briefly at the top.",
      "Lower under control until your hips are just short of the bottom of the range, and repeat for the desired number of repetitions."
    ]
  },
  "plate-loaded-lateral-raise": {
    "description": "A seated lateral raise on a plate-loaded machine, where pads bear against the upper arms so the side deltoids lift the load without the hands gripping it.",
    "equipment": "plate loaded lateral raise machine",
    "primary": [
      "lateral_deltoid"
    ],
    "secondary": [
      "anterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Set the seat height so that the pivot of the arm pads lines up with the point of your shoulders when you sit down.",
      "Load the plate horns evenly on both sides and sit with your back flat against the pad.",
      "Place the outside of your upper arms against the pads with your elbows bent and your arms hanging down.",
      "Push out and up against the pads until your upper arms are roughly level with your shoulders.",
      "Lower under control until your arms are back at your sides, and repeat for the desired number of repetitions."
    ]
  },
  "plate-loaded-shrug": {
    "description": "A standing shrug on a plate-loaded machine, lifting handles that hang at your sides so the traps work without a bar in front of or behind the legs.",
    "equipment": "shrug machine",
    "primary": [
      "trapezius"
    ],
    "secondary": [
      "forearm_flexors"
    ],
    "instructions": [
      "Load the plate horns evenly and stand on the machine platform, facing away from the frame.",
      "Take a handle in each hand with your arms hanging straight down at your sides and your shoulders relaxed.",
      "Stand tall with your chest up, your chin level and your knees soft.",
      "Shrug your shoulders straight up toward your ears as high as they will go, and hold for a moment at the top.",
      "Lower under control until your shoulders are fully down, and repeat for the desired number of repetitions."
    ]
  },
  "plate-pinch": {
    "description": "A grip-training staple: pinch two weight plates smooth-side out and hold them for time, loading the thumb and finger flexors in sustained isometric work.",
    "equipment": "plates",
    "primary": [
      "forearm_flexors"
    ],
    "secondary": [
      "trapezius"
    ],
    "instructions": [
      "Place two weight plates on the floor side by side with the smooth sides facing out.",
      "Squat down, grip both plates together between the fingers and thumb of one hand — no handles, just pinch.",
      "Stand up and hold the plates at the side for time, keeping the arm straight.",
      "Set them back down under control.",
      "Repeat on the other hand."
    ]
  },
  "plate-pullover": {
    "description": "A pullover holding a weight plate, working the lats, chest, and serratus.",
    "equipment": "plates",
    "primary": [
      "latissimus_dorsi",
      "pectoralis_major"
    ],
    "secondary": [
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie flat on a bench holding a plate with both hands.",
      "Press the plate over the chest with arms nearly straight.",
      "Lower the plate back in an arc behind the head until you feel a stretch.",
      "Pull the plate back over the chest along the same arc.",
      "Repeat for the prescribed reps."
    ]
  },
  "plow-pose": {
    "description": "An inversion in which the legs pass overhead until the toes reach the floor behind the head, lengthening the whole back of the body.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "hamstrings"
    ],
    "secondary": [
      "gluteus_maximus",
      "trapezius"
    ],
    "instructions": [
      "Lie on your back with the arms alongside the body, palms down.",
      "Lift both legs overhead and support the lower back with the hands.",
      "Lower the toes towards the floor behind the head, keeping the legs as straight as comfort allows.",
      "Hold the position for the prescribed time, breathing steadily and keeping the head still.",
      "Roll down one vertebra at a time with the hands supporting the back."
    ]
  },
  "plyo-lunge": {
    "description": "An explosive split-stance jump that switches the legs in mid-air, alternating each rep.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Start in a forward lunge with one foot ahead of the other.",
      "Drop into a deep lunge with the back knee almost touching the floor.",
      "Drive both feet off the floor, switching legs in mid-air.",
      "Land softly in a lunge with the opposite leg forward.",
      "Continue alternating without pausing."
    ]
  },
  "plyo-push-up": {
    "description": "An explosive push-up where the hands leave the floor at the top, training upper-body power.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major",
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Set up in a standard push-up position with hands shoulder-width.",
      "Lower yourself with control until the chest nearly touches the floor.",
      "Drive up explosively so the hands leave the floor.",
      "Land softly with the elbows slightly bent.",
      "Repeat without pausing for the prescribed reps."
    ]
  },
  "preacher-curl": {
    "description": "A curl variation using a preacher bench to isolate the biceps.",
    "equipment": "ez bar",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis"
    ],
    "instructions": [
      "Sit at a preacher bench with your upper arms resting on the pad.",
      "Hold an EZ-bar with an underhand grip.",
      "Curl the bar up toward your shoulders.",
      "Lower with control until arms are nearly straight.",
      "Repeat."
    ]
  },
  "preacher-hammer-curl": {
    "description": "A biceps curl performed on a preacher bench with a neutral, hammer grip to emphasize the brachialis and forearms.",
    "equipment": "dumbbell",
    "primary": [
      "brachialis",
      "brachioradialis"
    ],
    "secondary": [
      "biceps_brachii"
    ],
    "instructions": [
      "Sit at a preacher bench with a dumbbell in each hand.",
      "Rest your upper arms on the pad with palms facing each other.",
      "Curl the dumbbells up while keeping your wrists neutral.",
      "Squeeze your biceps at the top of the movement.",
      "Lower the dumbbells with control.",
      "Repeat for the desired number of reps."
    ]
  },
  "pseudo-planche-push-ups": {
    "description": "A push-up with hands turned back and shoulders leaned far past the wrists, mimicking planche loading.",
    "equipment": "bodyweight",
    "primary": [
      "anterior_deltoid",
      "pectoralis_major"
    ],
    "secondary": [
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Start in a push-up position with your hands turned so fingers point back.",
      "Lean your shoulders forward past your wrists.",
      "Lower your chest toward the floor by bending your elbows.",
      "Keep your body in a straight line.",
      "Press back up while maintaining the forward lean.",
      "Repeat for the desired number of reps."
    ]
  },
  "pull-up": {
    "description": "A bodyweight compound pull targeting the lats and biceps.",
    "equipment": "pull up bar",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "rhomboids"
    ],
    "instructions": [
      "Hang from a bar with an overhand grip, slightly wider than shoulder-width.",
      "Pull yourself up until your chin is over the bar.",
      "Lower yourself under control to a dead hang.",
      "Repeat."
    ]
  },
  "puppy-pose": {
    "description": "A kneeling pose halfway between child's pose and downward dog: the hips stay over the knees while the chest melts towards the floor, opening the shoulders and the upper back.",
    "equipment": "bodyweight",
    "primary": [
      "latissimus_dorsi",
      "posterior_deltoid"
    ],
    "secondary": [
      "erector_spinae",
      "trapezius"
    ],
    "instructions": [
      "Kneel on all fours with the hips over the knees and the hands under the shoulders.",
      "Walk the hands forward and lower the chest towards the floor, keeping the hips high.",
      "Rest the forehead or the chin on the mat and let the armpits soften downwards.",
      "Hold the position for the prescribed time, breathing into the upper back.",
      "Walk the hands back and sit onto the heels to come out."
    ]
  },
  "push-jerk": {
    "description": "An overhead lift using a leg dip and drive to launch the barbell overhead, caught in a quarter squat.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "secondary": [
      "gluteus_maximus",
      "quadriceps",
      "trapezius"
    ],
    "instructions": [
      "Hold a barbell in the front rack position at your shoulders.",
      "Stand with feet hip-width apart.",
      "Dip by bending your knees slightly.",
      "Drive explosively through your legs and press the bar overhead.",
      "Drop into a quarter-squat under the bar and lock out your arms.",
      "Stand up fully and lower the bar to repeat."
    ]
  },
  "push-press": {
    "description": "A barbell overhead press using leg drive to press heavier loads overhead.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "quadriceps",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand with a barbell racked on your front deltoids.",
      "Dip slightly at the knees.",
      "Drive up with your legs and press the bar overhead.",
      "Lock out fully.",
      "Lower to the start.",
      "Repeat."
    ]
  },
  "push-up": {
    "description": "A fundamental bodyweight exercise for the chest, shoulders, and triceps.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major",
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Start in a high plank position with hands shoulder-width apart.",
      "Lower your body until your chest nearly touches the floor.",
      "Push back up to the starting position.",
      "Keep your body in a straight line throughout.",
      "Repeat."
    ]
  },
  "pyramid-pose": {
    "description": "A standing forward fold over a straight front leg in a short split stance, which isolates the hamstring of the front leg while both hips stay square.",
    "equipment": "bodyweight",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "gastrocnemius"
    ],
    "instructions": [
      "Step one foot back about a leg's length and turn the back foot out slightly.",
      "Square both hip points towards the front of the mat and keep both legs straight.",
      "Hinge from the hips and fold over the front leg, bringing the hands to the floor, blocks or the shin.",
      "Hold the fold for the prescribed time with the spine long rather than rounded.",
      "Press into the feet to come up and repeat on the other side."
    ]
  },
  "rack-pull": {
    "description": "A partial-range deadlift variation performed from pins set at knee height, emphasizing the upper back, traps, and lockout strength with heavier-than-deadlift loads.",
    "equipment": "barbell",
    "primary": [
      "erector_spinae",
      "gluteus_maximus",
      "hamstrings",
      "trapezius"
    ],
    "secondary": [
      "forearm_flexors",
      "forearms",
      "latissimus_dorsi"
    ],
    "instructions": [
      "Set the safety pins in a power rack at knee height and place a loaded barbell on them.",
      "Stand with feet hip-width apart and grip the bar just outside your legs.",
      "Brace your core, retract your shoulder blades, and drive through your legs to lift the bar.",
      "Lock out your hips and knees fully at the top.",
      "Return the bar to the pins under control and reset before the next rep."
    ]
  },
  "rear-delt-fly": {
    "description": "An isolation movement targeting the posterior deltoids and upper back.",
    "equipment": "dumbbell",
    "primary": [
      "posterior_deltoid",
      "rhomboids"
    ],
    "secondary": [
      "trapezius"
    ],
    "instructions": [
      "Hold dumbbells and hinge forward at the hips.",
      "With a slight bend in elbows, raise the dumbbells out to the sides.",
      "Squeeze your shoulder blades at the top.",
      "Lower with control.",
      "Repeat."
    ]
  },
  "reverse-crunches": {
    "description": "An abdominal exercise curling the hips off the floor to emphasize the lower portion of the abs.",
    "equipment": "bodyweight",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "hip_flexors",
      "obliques",
      "transverse_abdominis"
    ],
    "instructions": [
      "Lie on your back with your arms at your sides.",
      "Raise your legs with knees bent to 90 degrees.",
      "Curl your hips off the floor by contracting your lower abs.",
      "Bring your knees toward your chest.",
      "Lower your hips with control.",
      "Repeat for the desired number of reps."
    ]
  },
  "reverse-curl": {
    "description": "A barbell curl with an overhand grip targeting the brachialis and forearm extensors.",
    "equipment": "barbell",
    "primary": [
      "brachialis",
      "forearm_extensors"
    ],
    "secondary": [
      "biceps_brachii"
    ],
    "instructions": [
      "Stand and hold a barbell with an overhand grip.",
      "Curl the bar up toward your shoulders.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "reverse-grip-bent-over-row": {
    "description": "A barbell row performed with an underhand grip, shifting emphasis toward the lower lats and biceps.",
    "equipment": "barbell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "erector_spinae",
      "trapezius"
    ],
    "instructions": [
      "Stand with feet shoulder-width apart and grip a barbell underhand.",
      "Hinge forward at the hips with a slight knee bend.",
      "Let the bar hang with your arms extended.",
      "Pull the bar to your lower abdomen by driving your elbows back.",
      "Squeeze your back at the top.",
      "Lower the bar with control.",
      "Repeat for the desired number of reps."
    ]
  },
  "reverse-grip-lat-pulldown": {
    "description": "A lat pulldown variation using an underhand grip that increases biceps involvement.",
    "equipment": "cable",
    "primary": [
      "biceps_brachii",
      "latissimus_dorsi"
    ],
    "secondary": [
      "posterior_deltoid",
      "rhomboids"
    ],
    "instructions": [
      "Attach a straight bar to a lat pulldown machine.",
      "Grip the bar with an underhand grip, shoulder-width apart.",
      "Sit and secure your thighs under the pad.",
      "Pull the bar down to your upper chest.",
      "Squeeze your lats and biceps at the bottom.",
      "Return the bar to the starting position with control.",
      "Repeat for the desired number of reps."
    ]
  },
  "reverse-lunge": {
    "description": "A lunge variation stepping backward for better knee stability.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Stand holding dumbbells at your sides.",
      "Step one leg back and lower your knee toward the floor.",
      "Lower until your front thigh is parallel to the floor.",
      "Push through your front heel to return to standing.",
      "Repeat on both sides."
    ]
  },
  "reverse-nordic-curl": {
    "description": "A bodyweight quadriceps exercise performed kneeling, leaning the torso backward under control while keeping the hips extended.",
    "equipment": "bodyweight",
    "primary": [
      "quadriceps"
    ],
    "secondary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "instructions": [
      "Kneel on a pad with your feet flat and torso upright.",
      "Keep your hips extended and core braced.",
      "Slowly lean your torso backward while keeping your body in a straight line.",
      "Lower as far as you can control with your quadriceps.",
      "Pull yourself back up to the starting position.",
      "Repeat for the desired number of reps."
    ]
  },
  "reverse-plank": {
    "description": "An isometric hold with the body facing upward, training the glutes, spinal erectors, and shoulder stability.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings",
      "posterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Sit on the floor with your legs extended in front of you.",
      "Place your hands behind you with fingers pointing toward your feet.",
      "Lift your hips off the floor to form a straight line from head to heels.",
      "Squeeze your glutes and brace your core.",
      "Hold the position for the desired duration.",
      "Lower your hips with control to exit."
    ]
  },
  "reverse-plank-dips": {
    "description": "Triceps dips from a straight-leg reverse plank: the legs stay extended and the hips high while the elbows bend and straighten.",
    "equipment": "bodyweight",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_maximus",
      "posterior_deltoid"
    ],
    "instructions": [
      "Sit with the legs straight and the hands on the floor behind the hips, fingers pointing forward.",
      "Press into the hands and heels and lift the hips into a straight-leg reverse plank.",
      "Bend the elbows straight back and lower the hips a short way towards the floor.",
      "Push back up until the arms lock out, keeping the hips high.",
      "Repeat for the desired number of repetitions."
    ]
  },
  "reverse-tabletop-hip-pulses": {
    "description": "Glute pulses from the reverse tabletop position: the arms stay straight and only the hips drop and lift, which keeps the work in the glutes rather than the triceps.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings"
    ],
    "instructions": [
      "Sit with the knees bent, the feet flat and the hands on the floor behind you.",
      "Press into the hands and feet and lift the hips until the trunk is level with the knees.",
      "Keeping the elbows straight, lower the hips a few centimetres.",
      "Squeeze the glutes to lift them back to level.",
      "Pulse for the desired number of repetitions and lower down."
    ]
  },
  "reverse-tabletop-hold": {
    "description": "A static reverse tabletop: knees bent, hands under the shoulders behind the body, hips lifted level with the knees and held, so the glutes and the whole back of the trunk work isometrically.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings",
      "posterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Sit with the knees bent, the feet flat and the hands on the floor behind you, fingers pointing towards the heels.",
      "Press into the hands and feet and lift the hips until the trunk is level with the knees.",
      "Open the chest, draw the shoulders away from the ears and look straight ahead.",
      "Hold the position for the prescribed time with the hips high.",
      "Lower the hips under control to finish."
    ]
  },
  "revolved-chair-pose": {
    "description": "Chair pose with a closed twist: the hips stay level and low while the chest rotates and one elbow hooks outside the opposite thigh.",
    "equipment": "bodyweight",
    "primary": [
      "obliques",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_maximus"
    ],
    "instructions": [
      "Set up in chair pose with the knees bent, the hips back and the palms together at the chest.",
      "Keep the knees level with each other so the hips do not open into the twist.",
      "Rotate the chest to one side and hook the opposite elbow outside that thigh.",
      "Press the palms together and hold for the prescribed time, lengthening the spine on each inhale.",
      "Come back to centre and repeat on the other side."
    ]
  },
  "revolved-crescent-lunge": {
    "description": "A high lunge with a closed twist: the back heel stays lifted, the hips face forward and the chest rotates over the front thigh.",
    "equipment": "bodyweight",
    "primary": [
      "obliques",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "hip_flexors"
    ],
    "instructions": [
      "Step into a high lunge with the front knee over the ankle and the back heel lifted.",
      "Bring the palms together at the chest and square both hips towards the front of the mat.",
      "Rotate the chest towards the front leg and hook the opposite elbow outside the thigh.",
      "Hold the twist for the prescribed time, pressing the back heel towards the wall behind you.",
      "Unwind and repeat on the other side."
    ]
  },
  "ring-dead-hang": {
    "description": "A passive hang from gymnastic rings. The free-rotating grip recruits more stabilisers in the hands, forearms, and shoulder girdle than a fixed bar.",
    "equipment": "rings",
    "primary": [
      "forearm_flexors"
    ],
    "secondary": [
      "latissimus_dorsi",
      "rectus_abdominis",
      "trapezius"
    ],
    "instructions": [
      "Grip a pair of gymnastic rings with a neutral grip, palms facing each other.",
      "Hang with your arms fully extended and feet off the ground.",
      "Let the rings rotate naturally; do not fight the grip.",
      "Keep your shoulders engaged (no shrug to the ears) and core lightly braced.",
      "Hold for the desired duration."
    ]
  },
  "ring-dips": {
    "description": "A challenging bodyweight dip performed on gymnastic rings, demanding greater stabilization than bar dips.",
    "equipment": "rings",
    "primary": [
      "pectoralis_major",
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Support yourself on the rings with arms locked out.",
      "Lower your body by bending the elbows until upper arms are parallel to the ground.",
      "Press back up to the starting position.",
      "Repeat."
    ]
  },
  "ring-face-pull": {
    "description": "A face pull using gymnastic rings for adjustable resistance and improved shoulder health.",
    "equipment": "rings",
    "primary": [
      "posterior_deltoid",
      "rhomboids"
    ],
    "secondary": [
      "trapezius"
    ],
    "instructions": [
      "Grip the rings and lean back so your body is at an angle.",
      "Pull the rings toward your face, flaring elbows to the sides.",
      "Hold briefly, then return.",
      "Repeat."
    ]
  },
  "ring-muscle-up": {
    "description": "An advanced calisthenics movement combining a pull-up and a dip on gymnastic rings.",
    "equipment": "rings",
    "primary": [
      "latissimus_dorsi",
      "pectoralis_major",
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "biceps_brachii",
      "rhomboids"
    ],
    "instructions": [
      "Hang from the rings with a false grip, palms facing each other.",
      "Pull explosively, driving the chest up to the rings.",
      "Transition the elbows over the rings as the chest rises.",
      "Press to full arm extension at the top.",
      "Lower under control through the transition back to the hang."
    ]
  },
  "ring-push-up": {
    "description": "A push-up performed on gymnastic rings, increasing the demand on stabilizers in the chest, shoulders, and core.",
    "equipment": "rings",
    "primary": [
      "pectoralis_major",
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid",
      "serratus_anterior"
    ],
    "instructions": [
      "Set the rings just above floor height.",
      "Grip the rings and assume a plank position with arms straight.",
      "Lower the chest toward the rings, keeping the elbows close to the body.",
      "Press back up to full arm extension.",
      "Repeat for the prescribed reps."
    ]
  },
  "ring-row": {
    "description": "A bodyweight row on gymnastic rings, performed at an angle for back and biceps work.",
    "equipment": "rings",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Set the rings at hip to chest height.",
      "Grip the rings with palms facing each other, lean back at an angle with arms straight.",
      "Brace the core and pull the chest toward the rings.",
      "Squeeze the shoulder blades together at the top.",
      "Lower under control to a full-arm extension."
    ]
  },
  "rings-inverted-row": {
    "description": "A horizontal bodyweight row on gymnastic rings set near the floor, more challenging than a standing ring row.",
    "equipment": "rings",
    "primary": [
      "latissimus_dorsi",
      "rhomboids",
      "trapezius"
    ],
    "secondary": [
      "biceps_brachii",
      "forearm_flexors",
      "posterior_deltoid",
      "rectus_abdominis"
    ],
    "instructions": [
      "Set the rings just above hip height.",
      "Lie under the rings and grip them with palms facing each other.",
      "Walk the feet forward so the body forms a straight line.",
      "Pull the chest toward the rings, squeezing the shoulder blades.",
      "Lower under control to a full-arm extension."
    ]
  },
  "romanian-deadlift": {
    "description": "A hip-hinge movement emphasizing the hamstrings and glutes.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae"
    ],
    "instructions": [
      "Stand holding a barbell at hip level with an overhand grip.",
      "Hinge at the hips, pushing them back while keeping legs nearly straight.",
      "Lower the bar along your legs until you feel a hamstring stretch.",
      "Drive your hips forward to return to standing.",
      "Repeat."
    ]
  },
  "rope-climb": {
    "description": "A total-body pulling exercise that climbs a vertical rope hand-over-hand, loading the lats, biceps, grip, and core isometrically.",
    "equipment": "climbing rope",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "forearm_flexors",
      "rectus_abdominis"
    ],
    "instructions": [
      "Grip the rope as high as you can with both hands.",
      "Either wrap the rope around one foot (S-hook or J-hook) or pinch it between both feet.",
      "Pull yourself up while the feet squeeze to support body weight and release rope.",
      "Reach higher with one hand, then the other, and re-clamp with the feet.",
      "Repeat until you reach the top of the rope.",
      "Descend hand-under-hand with the feet controlling the speed — never slide."
    ]
  },
  "rowing-machine": {
    "description": "A full-body cardio machine movement in which each stroke drives with the legs, swings the torso back and pulls the handle to the ribs, training the legs, back and arms in one continuous cycle.",
    "equipment": "rower",
    "primary": [
      "latissimus_dorsi",
      "quadriceps"
    ],
    "secondary": [
      "biceps_brachii",
      "erector_spinae",
      "gluteus_maximus",
      "hamstrings",
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Sit on the rower, strap your feet into the footplates and take the handle with an overhand grip.",
      "Slide forward into the catch: shins vertical, torso leaning slightly ahead of the hips, arms straight out toward the flywheel.",
      "Drive through your legs first, pushing the seat back until your knees are almost straight.",
      "Swing your torso back past vertical, then pull the handle in to your lower ribs with your elbows travelling past your sides.",
      "Reverse the order on the recovery — arms away, torso forward, then bend the knees — and slide back to the catch for the next stroke.",
      "Continue for the desired time, distance or number of strokes."
    ]
  },
  "running": {
    "description": "Unaided running over ground, with a flight phase in every stride where neither foot is down — the impact and the effort that separates it from walking.",
    "equipment": "bodyweight",
    "primary": [
      "gastrocnemius",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_maximus",
      "hamstrings",
      "hip_flexors",
      "soleus"
    ],
    "instructions": [
      "Start from an easy jog and build into your pace over the first few minutes rather than setting off at target speed.",
      "Land with your foot under your hips, not out in front, and keep the contact with the ground short and quiet.",
      "Run tall through the hips with a slight forward lean from the ankles, not a fold at the waist.",
      "Bend your elbows to about ninety degrees and drive your arms forward and back, keeping them off your chest.",
      "Breathe rhythmically and keep your shoulders, jaw and hands loose.",
      "Hold the pace for the desired time or distance, then jog and walk for a few minutes to finish."
    ]
  },
  "russian-twist": {
    "description": "A rotational core exercise targeting the obliques.",
    "equipment": "bodyweight",
    "primary": [
      "obliques",
      "rectus_abdominis"
    ],
    "secondary": [
      "hip_flexors"
    ],
    "instructions": [
      "Sit on the floor with knees bent, lean back slightly.",
      "Hold your hands together or hold a weight at chest level.",
      "Rotate your torso to one side, then the other.",
      "Keep your core braced throughout.",
      "Repeat."
    ]
  },
  "savasana": {
    "description": "The closing rest of a practice: lying flat on the back with the body completely passive, letting the effects of the session settle.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae"
    ],
    "secondary": [],
    "instructions": [
      "Lie on your back with the legs a comfortable distance apart and the feet falling open.",
      "Rest the arms slightly away from the body with the palms facing up.",
      "Let the whole body soften into the floor, including the jaw, the eyes and the hands.",
      "Stay for the prescribed time, breathing naturally without controlling the breath.",
      "Bend the knees and roll to one side before sitting up slowly."
    ]
  },
  "scapular-pull-ups": {
    "description": "A straight-arm hang exercise lifting the chest by depressing and retracting the shoulder blades, building pull-up strength.",
    "equipment": "pull up bar",
    "primary": [
      "latissimus_dorsi",
      "trapezius"
    ],
    "secondary": [
      "forearm_flexors",
      "rhomboids"
    ],
    "instructions": [
      "Hang from a pull-up bar with arms fully extended.",
      "Keep your arms straight throughout the movement.",
      "Depress and retract your shoulder blades to lift your chest.",
      "Pause briefly at the top of the movement.",
      "Return to a fully hanging position.",
      "Repeat for the desired number of reps."
    ]
  },
  "scissor-kicks": {
    "description": "A core exercise performed lying on the back, alternating straight-leg crosses to target the lower abdominals and hip flexors.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques",
      "transverse_abdominis"
    ],
    "instructions": [
      "Lie flat on your back with your hands under your glutes.",
      "Lift both legs a few inches off the floor.",
      "Alternate crossing one leg over the other in a scissor motion.",
      "Keep your lower back pressed into the floor.",
      "Maintain a steady rhythm throughout.",
      "Repeat for the desired number of reps."
    ]
  },
  "seated-barbell-overhead-press": {
    "description": "A strict seated overhead press with a barbell, removing hip drive and isolating the deltoids and triceps.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid"
    ],
    "secondary": [
      "lateral_deltoid",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Set an upright bench inside a rack with the pins at about shoulder height when seated.",
      "Sit with your back flat against the pad and unrack the barbell at the front of the shoulders.",
      "Press the bar overhead until the arms are fully extended, tucking the head through at the top.",
      "Lower the bar back to the collarbones under control.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "seated-cable-row": {
    "description": "A back exercise performed on a cable row machine, pulling a handle toward the torso while seated.",
    "equipment": "cable",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "erector_spinae",
      "posterior_deltoid"
    ],
    "instructions": [
      "Sit at the cable row station and place your feet on the footrests.",
      "Grip the handle and sit upright with a slight forward lean.",
      "Drive your elbows back and pull the handle toward your lower abdomen.",
      "Squeeze your shoulder blades together at the end of the pull.",
      "Extend your arms under control back to the starting position.",
      "Repeat for the desired number of reps."
    ]
  },
  "seated-calf-raise": {
    "description": "A machine calf raise performed seated to specifically target the soleus muscle.",
    "equipment": "seated calf raise machine",
    "primary": [
      "soleus"
    ],
    "secondary": [
      "gastrocnemius"
    ],
    "instructions": [
      "Sit at a calf raise machine with the pads resting on your thighs.",
      "Lower your heels as far as possible.",
      "Raise up onto your toes.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "seated-db-press": {
    "description": "A seated pressing movement for the shoulders using dumbbells.",
    "equipment": "dumbbell",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Sit on a bench with back support, holding dumbbells at shoulder height.",
      "Press the dumbbells overhead until arms are fully extended.",
      "Lower the dumbbells back to shoulder level.",
      "Repeat."
    ]
  },
  "seated-dumbbell-curl": {
    "description": "A seated bicep curl with dumbbells, the upright seated position removing body momentum for stricter form.",
    "equipment": "dumbbell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis",
      "brachioradialis"
    ],
    "instructions": [
      "Sit on a bench with a dumbbell in each hand.",
      "Let your arms hang at your sides with palms facing forward.",
      "Curl both dumbbells toward your shoulders by flexing your biceps.",
      "Squeeze at the top of the movement.",
      "Lower the dumbbells with control.",
      "Repeat for the desired number of reps."
    ]
  },
  "seated-dumbbell-lateral-raise": {
    "description": "A seated isolation exercise raising dumbbells out to the sides, targeting the side deltoids without leg drive.",
    "equipment": "dumbbell",
    "primary": [
      "lateral_deltoid"
    ],
    "secondary": [
      "anterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Sit on a bench with a dumbbell in each hand at your sides.",
      "Keep your back upright and core braced.",
      "Raise both dumbbells out to the sides until they reach shoulder height.",
      "Keep a slight bend in your elbows.",
      "Lower the dumbbells with control.",
      "Repeat for the desired number of reps."
    ]
  },
  "seated-dumbbell-tricep-extension": {
    "description": "A seated overhead extension lowering a dumbbell behind the head, stretching and working the triceps.",
    "equipment": "dumbbell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Sit on a bench with a dumbbell held overhead in both hands.",
      "Keep your upper arms vertical next to your ears.",
      "Lower the dumbbell behind your head by bending your elbows.",
      "Extend your arms to press the dumbbell back overhead.",
      "Squeeze your triceps at the top.",
      "Repeat for the desired number of reps."
    ]
  },
  "seated-forward-fold": {
    "description": "A seated stretch that targets the hamstrings and lower back by reaching the torso over straight legs.",
    "equipment": "bodyweight",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae"
    ],
    "instructions": [
      "Sit on the floor with both legs straight out in front.",
      "Keep your back long and hinge forward from the hips.",
      "Reach your hands toward your feet.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "seated-leg-curl": {
    "description": "A machine isolation exercise for the hamstrings performed in a seated position, providing consistent tension and reduced hip flexor involvement compared to the lying variant.",
    "equipment": "leg curl",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "gastrocnemius"
    ],
    "instructions": [
      "Adjust the seat back and ankle pad so your knees align with the machine's pivot point.",
      "Sit upright, place the backs of your ankles on top of the pad, and grip the handles.",
      "Curl your lower legs down and back under the seat as far as the machine allows.",
      "Pause at peak contraction, then return the weight slowly to the starting position.",
      "Repeat for the desired reps."
    ]
  },
  "seated-smith-machine-shoulder-press": {
    "description": "A seated overhead press on the Smith machine, using the fixed bar path to keep the focus on the deltoids.",
    "equipment": "smith machine",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Position a bench inside a Smith machine.",
      "Sit facing forward with the bar at shoulder height.",
      "Grip the bar slightly wider than shoulder-width.",
      "Unrack and press the bar straight up until your arms are extended.",
      "Lower the bar back to shoulder height with control.",
      "Repeat for the desired number of reps."
    ]
  },
  "seated-spinal-twist": {
    "description": "A seated rotation that stretches the obliques, mid-back and glutes by twisting toward a bent knee.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "obliques"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Sit with one leg straight and cross the other foot over it.",
      "Brace the opposite elbow against the outside of the bent knee.",
      "Rotate your torso toward the bent knee and look over your shoulder.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "seated-straddle-stretch": {
    "description": "A wide-legged seated stretch for the inner thighs and hamstrings, folding the torso forward between the legs.",
    "equipment": "bodyweight",
    "primary": [
      "adductors",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae"
    ],
    "instructions": [
      "Sit with your legs straight and spread wide in a V.",
      "Keep your back long and hinge forward from the hips.",
      "Walk your hands forward along the floor.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "shrug": {
    "description": "An isolation movement for the upper trapezius.",
    "equipment": "barbell",
    "primary": [
      "trapezius"
    ],
    "secondary": [
      "rhomboids"
    ],
    "instructions": [
      "Stand holding a barbell at arm's length with an overhand grip.",
      "Shrug your shoulders straight up toward your ears.",
      "Hold briefly at the top.",
      "Lower your shoulders back down with control.",
      "Repeat."
    ]
  },
  "side-lunge": {
    "description": "A lateral lunge stepping wide to one side, training the quads, glutes, and inner thighs through a side-to-side pattern.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings",
      "hip_flexors"
    ],
    "instructions": [
      "Stand with feet hip-width apart and hands at your chest.",
      "Step one leg wide to the side, keeping the other leg straight.",
      "Bend the stepping knee and push your hips back into a lateral squat.",
      "Keep your chest up and the working heel planted.",
      "Drive through the bent leg to return to standing.",
      "Complete reps on one side, then switch."
    ]
  },
  "side-lying-hip-abduction": {
    "description": "A bodyweight isolation exercise targeting the gluteus medius and hip abductors.",
    "equipment": "bodyweight",
    "primary": [
      "abductors",
      "gluteus_medius"
    ],
    "secondary": [],
    "instructions": [
      "Lie on your side with legs stacked.",
      "Keep the bottom leg slightly bent.",
      "Raise the top leg toward the ceiling.",
      "Lower under control.",
      "Repeat on both sides."
    ]
  },
  "side-lying-hip-abduction-hold": {
    "description": "The top of the side-lying leg raise held for time: lying on one side with the top leg lifted and slightly behind the body, loading the glute medius isometrically.",
    "equipment": "bodyweight",
    "primary": [
      "abductors",
      "gluteus_medius"
    ],
    "secondary": [],
    "instructions": [
      "Lie on one side with the legs stacked and straight, and support the head on the lower arm.",
      "Brace the trunk so the torso stays square and does not roll backwards.",
      "Lift the top leg to about 30 to 45 degrees, keeping the toes pointing forward.",
      "Hold the leg there for the prescribed time, breathing normally.",
      "Lower the leg under control and repeat on the other side."
    ]
  },
  "side-lying-hip-adduction": {
    "description": "A side-lying exercise raising the bottom leg against gravity, training hip adduction with body weight alone.",
    "equipment": "bodyweight",
    "primary": [
      "adductors"
    ],
    "secondary": [],
    "instructions": [
      "Lie on your side with your bottom leg straight.",
      "Bend your top leg and place its foot flat in front of the bottom thigh.",
      "Support your head with your bottom arm.",
      "Lift the bottom leg upward toward the ceiling.",
      "Lower the leg back down under control.",
      "Complete reps on one side, then switch."
    ]
  },
  "side-lying-hip-adduction-hold": {
    "description": "The top of the side-lying inner-thigh raise held for time: lying on one side with the top leg crossed over and the bottom leg lifted off the floor by the adductors.",
    "equipment": "bodyweight",
    "primary": [
      "adductors"
    ],
    "secondary": [],
    "instructions": [
      "Lie on one side with the bottom leg straight and the top leg crossed over it, foot flat on the floor.",
      "Support the head on the lower arm and keep the hips stacked vertically.",
      "Lift the bottom leg as high as it will go with the knee straight and the toes pointing forward.",
      "Hold that lifted position for the prescribed time without rolling the hips back.",
      "Lower the leg under control and repeat on the other side."
    ]
  },
  "side-lying-lateral-raise": {
    "description": "A dumbbell lateral deltoid isolation exercise performed lying on one side on a flat bench, providing constant tension and eliminating momentum from the standing position.",
    "equipment": "dumbbell",
    "primary": [
      "lateral_deltoid"
    ],
    "secondary": [
      "supraspinatus",
      "trapezius"
    ],
    "instructions": [
      "Lie on your side on a flat bench with your bottom arm supporting your head or gripping the bench edge.",
      "Hold a dumbbell in your top hand with your arm resting along your side.",
      "Keeping your elbow slightly bent, raise the dumbbell upward until your arm is perpendicular to the floor.",
      "Pause briefly at the top, then lower the dumbbell slowly back to your side.",
      "Complete all reps on one side before switching."
    ]
  },
  "side-plank": {
    "description": "A lateral plank variation targeting the obliques and lateral core.",
    "equipment": "bodyweight",
    "primary": [
      "obliques",
      "transverse_abdominis"
    ],
    "secondary": [
      "gluteus_medius",
      "rectus_abdominis"
    ],
    "instructions": [
      "Lie on your side with your forearm on the floor, elbow under your shoulder.",
      "Lift your hips off the floor, forming a straight line from head to feet.",
      "Hold the position, keeping your core tight.",
      "Breathe steadily.",
      "Repeat on both sides."
    ]
  },
  "side-plank-leg-lift": {
    "description": "A side plank with the top leg raising up, combining lateral core work with hip abduction.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_medius",
      "obliques"
    ],
    "secondary": [
      "gluteus_maximus",
      "rectus_abdominis",
      "transverse_abdominis"
    ],
    "instructions": [
      "Lie on your side with the forearm on the floor, elbow under the shoulder.",
      "Stack the feet and lift the hips into a side plank.",
      "From this stable side plank, raise the top leg straight up toward the ceiling.",
      "Lower the leg back down with control without dropping the hips.",
      "Complete reps on one side, then switch."
    ]
  },
  "side-plank-leg-lift-hold": {
    "description": "A side plank held with the top leg raised: the hips stay lifted and square while the top leg is abducted, adding a glute medius demand to the lateral trunk hold.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_medius",
      "obliques"
    ],
    "secondary": [
      "gluteus_maximus",
      "rectus_abdominis",
      "transverse_abdominis"
    ],
    "instructions": [
      "Set up in a side plank on the forearm with the elbow under the shoulder and the feet stacked.",
      "Lift the hips until the body forms a straight line from the ankles to the head.",
      "Raise the top leg to roughly hip height, keeping the toes pointing forward.",
      "Hold the position for the prescribed time, keeping the hips high and the shoulder stacked.",
      "Lower the leg and the hips under control and repeat on the other side."
    ]
  },
  "single-arm-chest-supported-dumbbell-row": {
    "description": "A unilateral row performed one arm at a time on a chest-supported incline bench, isolating each side of the back and reducing momentum.",
    "equipment": "dumbbell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid"
    ],
    "instructions": [
      "Lie face-down on an incline bench holding a dumbbell in one hand, arm hanging straight down.",
      "Row the dumbbell up to your side, driving your elbow past your torso.",
      "Squeeze your shoulder blade at the top, then lower under control.",
      "Complete all reps on one side before switching arms."
    ]
  },
  "single-arm-db-row": {
    "description": "A unilateral back exercise using a dumbbell for balanced development.",
    "equipment": "dumbbell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid"
    ],
    "instructions": [
      "Place one knee and hand on a bench for support.",
      "Hold a dumbbell in the other hand with arm extended.",
      "Pull the dumbbell up toward your hip, squeezing your shoulder blade.",
      "Lower the dumbbell with control.",
      "Repeat on both sides."
    ]
  },
  "single-arm-dumbbell-overhead-tricep-extension": {
    "description": "A one-arm overhead tricep extension giving a long, unilateral stretch of the long head and training anti-side-bend core stability.",
    "equipment": "dumbbell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "obliques"
    ],
    "instructions": [
      "Stand or sit holding a dumbbell in one hand overhead, arm fully extended.",
      "The palm faces forward; the other hand can hold your waist or an upright for stability.",
      "Bend the elbow to lower the dumbbell behind the head in a controlled arc.",
      "Keep the upper arm vertical and close to the head throughout.",
      "Extend the elbow to return the dumbbell overhead.",
      "Complete all reps on one side, then switch."
    ]
  },
  "single-arm-hammer-curl": {
    "description": "A unilateral dumbbell curl with a neutral grip that keeps the working elbow close to the torso while the brachialis and brachioradialis flex the elbow.",
    "equipment": "dumbbell",
    "primary": [
      "brachialis",
      "brachioradialis"
    ],
    "secondary": [
      "biceps_brachii",
      "forearm_flexors"
    ],
    "instructions": [
      "Stand with your feet about hip-width apart and hold one dumbbell at your side with the palm facing inward.",
      "Brace your trunk and keep the working upper arm beside your ribs as the arm hangs straight.",
      "Curl the dumbbell toward your shoulder without rotating the palm or swinging the torso.",
      "Squeeze the elbow flexors at the top, then lower the dumbbell under control until the arm is straight.",
      "Complete the repetitions on one side, then switch arms and repeat."
    ]
  },
  "single-arm-machine-shoulder-press": {
    "description": "A unilateral seated machine shoulder press that lets one arm press independently while the back stays supported and the machine controls the resistance path.",
    "equipment": "shoulder press machine",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Adjust the seat so the working handle starts around shoulder height and sit with your back firmly against the pad.",
      "Grip one handle with the wrist straight and keep the free hand on the support or resting comfortably.",
      "Press the handle upward without leaning away from the back pad or rotating the torso.",
      "Lower the handle under control until the elbow is just below the starting line, then repeat.",
      "Complete the repetitions on one side, adjust the seat if needed, and train the other side."
    ]
  },
  "single-arm-plate-loaded-lateral-raise": {
    "description": "The plate-loaded machine lateral raise worked one arm at a time, so each side lifts its own load and the two can be trained to the same standard.",
    "equipment": "plate loaded lateral raise machine",
    "primary": [
      "lateral_deltoid"
    ],
    "secondary": [
      "anterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Set the seat height so the pad pivot lines up with your shoulder, and load only the side you are about to work.",
      "Sit with your back flat against the pad and place the outside of your working upper arm against its pad.",
      "Hold the handle on the free side or rest that hand in your lap, and keep your torso square to the seat.",
      "Push the working arm out and up against the pad until the upper arm is level with your shoulder, then lower it under control.",
      "Complete all the repetitions on that side, then load and work the other side."
    ]
  },
  "single-arm-tricep-pushdown": {
    "description": "A triceps isolation exercise performed one arm at a time on a cable machine with a single handle.",
    "equipment": "cable",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [
      "forearm_extensors"
    ],
    "instructions": [
      "Attach a single handle to a high cable pulley.",
      "Grasp the handle with one hand and keep your elbow pinned to your side.",
      "Press the handle down until your arm is fully extended.",
      "Squeeze the triceps at the bottom.",
      "Slowly return to the start position.",
      "Complete reps on one side, then switch."
    ]
  },
  "single-db-svend-press": {
    "description": "A standing chest press holding one dumbbell upright between the palms, where the inward squeeze rather than the load is what works the pecs.",
    "equipment": "dumbbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand tall and hold a single dumbbell upright in front of your sternum, the handle running vertically between your flat palms.",
      "Squeeze your palms hard into the dumbbell so the chest takes the tension and the weight cannot slip.",
      "Press the dumbbell straight forward until your arms are fully extended, keeping it at chest height the whole way out.",
      "Pause briefly without letting the squeeze go, then draw the dumbbell back to your chest under control.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "single-leg-calf-raise": {
    "description": "A unilateral calf raise that loads one calf at a time, exposing strength imbalances side to side.",
    "equipment": "bodyweight",
    "primary": [
      "gastrocnemius"
    ],
    "secondary": [
      "soleus"
    ],
    "instructions": [
      "Stand on one foot with the ball of the foot on a raised platform, heel free.",
      "Hold a wall or rail for balance with one hand.",
      "Drop the heel below platform level for a deep stretch.",
      "Drive up onto the toes as high as possible.",
      "Lower under control. Complete reps per side, then switch."
    ]
  },
  "single-leg-extension": {
    "description": "A quadriceps isolation exercise performed on a leg extension machine, working one leg at a time.",
    "equipment": "leg extension",
    "primary": [
      "quadriceps"
    ],
    "secondary": [],
    "instructions": [
      "Sit on a leg extension machine and place one foot under the pad.",
      "Rest the other foot on the floor or let it hang.",
      "Extend the working leg until it is nearly straight.",
      "Squeeze the quadriceps at the top.",
      "Lower the leg back down under control.",
      "Complete reps on one side, then switch."
    ]
  },
  "single-leg-glute-bridge": {
    "description": "A unilateral glute bridge that loads one glute at a time and helps even out side-to-side imbalances.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings"
    ],
    "instructions": [
      "Lie on your back with one knee bent, foot flat, the other leg extended straight.",
      "Brace the core and squeeze the glute on the working side.",
      "Drive the hips up by pressing through the working heel.",
      "Pause at the top with the body in a straight line from shoulders to knee.",
      "Lower under control. Complete reps per side, then switch."
    ]
  },
  "single-leg-glute-bridge-hold": {
    "description": "The top of the single-leg glute bridge held for time: hips extended and level while one leg is lifted, so one glute carries the whole position.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings"
    ],
    "instructions": [
      "Lie on your back with one knee bent and that foot flat, and lift the other leg so the thigh is roughly vertical.",
      "Push through the heel of the planted foot and lift the hips until the body is straight from the knee to the shoulders.",
      "Level the pelvis so the lifted side does not drop, and tuck the ribs down.",
      "Hold the top position for the prescribed time, keeping the lifted knee still.",
      "Lower the hips under control and repeat on the other side."
    ]
  },
  "single-leg-lying-leg-curl": {
    "description": "A unilateral hamstring isolation on the lying leg curl machine, addressing strength imbalances between legs.",
    "equipment": "leg curl",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "gastrocnemius"
    ],
    "instructions": [
      "Lie face down on a lying leg curl machine.",
      "Position one ankle under the pad, keeping the other foot off the machine.",
      "Curl the working leg by bringing your heel toward your glute.",
      "Squeeze the hamstring at the top.",
      "Lower the leg back down under control.",
      "Complete reps on one side, then switch."
    ]
  },
  "single-leg-press": {
    "description": "A lower-body exercise performed on a leg press machine, pressing the platform with one leg at a time.",
    "equipment": "leg press",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Sit in a leg press machine with one foot placed on the platform.",
      "Keep the other leg off the platform, resting to the side.",
      "Release the safeties and lower the platform by bending your knee.",
      "Stop when your knee is near a 90-degree angle.",
      "Drive through the heel to press the platform back up.",
      "Complete reps on one side, then switch."
    ]
  },
  "single-leg-romanian-deadlift": {
    "description": "A single-leg hip hinge with dumbbells, training the hamstrings and glutes while challenging balance and hip stability.",
    "equipment": "dumbbell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius"
    ],
    "instructions": [
      "Stand on one leg holding a dumbbell in each hand in front of your thighs.",
      "Keep a slight bend in the standing knee.",
      "Hinge at the hip while extending the free leg behind you.",
      "Lower the dumbbells along your standing leg until you feel a hamstring stretch.",
      "Drive through the heel to return to upright.",
      "Complete reps on one side, then switch."
    ]
  },
  "sit-ups": {
    "description": "A classic abdominal exercise with a full range of motion.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques"
    ],
    "instructions": [
      "Lie on your back with knees bent and feet anchored.",
      "Cross your arms over your chest or place hands behind your head.",
      "Sit all the way up until your torso is upright.",
      "Lower back down with control.",
      "Repeat."
    ]
  },
  "skull-crusher": {
    "description": "A lying triceps extension using a barbell to isolate the triceps through a full range of motion.",
    "equipment": "barbell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Lie on a flat bench holding a barbell over your chest with a narrow grip.",
      "Lower the bar toward your forehead by bending at the elbows.",
      "Extend your arms back to the start.",
      "Repeat."
    ]
  },
  "sled-row": {
    "description": "A loaded carry-and-pull performed by gripping a sled and rowing it toward you as you walk backwards, training the back through a continuous drag rather than discrete reps.",
    "equipment": "sled",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "gluteus_maximus",
      "posterior_deltoid",
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Load a sled and grip its uprights with both hands, one to each post.",
      "Stand facing the sled with the arms extended and the torso leaned back slightly against the load.",
      "Pull the sled toward you by driving the elbows back, and take a short step backwards as you do.",
      "Extend the arms again, step back once more, and repeat the pull.",
      "Continue for distance or time, keeping a steady pull-and-step rhythm."
    ]
  },
  "smith-machine-bench-press": {
    "description": "A bench press variation in the Smith machine, where the guided bar path adds stability for the chest.",
    "equipment": "smith machine",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on a flat bench set inside a Smith machine.",
      "Grip the bar slightly wider than shoulder-width and unrack it.",
      "Lower the bar under control to your mid-chest.",
      "Pause briefly without bouncing.",
      "Press the bar back up until your arms are fully extended.",
      "Repeat for the desired number of reps."
    ]
  },
  "smith-machine-bent-over-row": {
    "description": "A bent-over row in the Smith machine, with a fixed bar path that keeps the pull strict for the lats.",
    "equipment": "smith machine",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "erector_spinae",
      "trapezius"
    ],
    "instructions": [
      "Stand inside a Smith machine with feet shoulder-width apart.",
      "Grip the bar with an overhand grip slightly wider than shoulders.",
      "Hinge at the hips until your torso is roughly 45 degrees.",
      "Pull the bar toward your lower chest by driving your elbows back.",
      "Squeeze your shoulder blades at the top.",
      "Lower the bar under control and repeat."
    ]
  },
  "smith-machine-bulgarian-split": {
    "description": "A Bulgarian split squat performed in a Smith machine for added stability and load control.",
    "equipment": "smith machine",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Set up a bench behind the Smith machine. Rest the bar on your traps.",
      "Place the rear foot on the bench and front foot forward.",
      "Lower your back knee toward the floor.",
      "Push through the front heel to return.",
      "Repeat on both sides."
    ]
  },
  "smith-machine-calf-raise": {
    "description": "A standing calf raise under the Smith machine bar, performed on a platform for a full stretch and contraction.",
    "equipment": "smith machine",
    "primary": [
      "gastrocnemius"
    ],
    "secondary": [
      "soleus"
    ],
    "instructions": [
      "Place the Smith machine bar across your upper back and shoulders.",
      "Stand on a small platform so your heels can drop below your toes.",
      "Unrack the bar and raise up onto the balls of your feet.",
      "Squeeze your calves hard at the top.",
      "Lower your heels below the platform for a full stretch.",
      "Repeat for the desired number of reps."
    ]
  },
  "smith-machine-decline-bench-press": {
    "description": "A bench press on a decline bench under the Smith machine, where the head-down angle and the guided bar path put the work on the lower chest.",
    "equipment": "smith machine",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Set a decline bench in the machine so the bar lines up with your lower chest when you lie down, and hook your legs under the pads.",
      "Lie back with your head at the low end, take an overhand grip slightly wider than your shoulders and unrack the bar.",
      "Lower the bar under control until it touches your lower chest, keeping your elbows at roughly forty-five degrees from your torso.",
      "Press the bar back up until your arms are extended, without locking the elbows out hard.",
      "Repeat for the desired number of repetitions, then rack the bar before releasing your legs."
    ]
  },
  "smith-machine-front-squat": {
    "description": "A squat on the Smith machine with the bar racked across the front of the shoulders, where the fixed path and the upright torso keep the work on the quads.",
    "equipment": "smith machine",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Set the bar at upper-chest height and step under it so it rests across the front of your shoulders, against your collarbones.",
      "Cross your arms over the bar or take an open front-rack grip, and drive your elbows up until your upper arms are close to parallel with the floor.",
      "Unrack the bar and stand with your feet about shoulder-width apart and slightly forward of it.",
      "Sit straight down, keeping your elbows high and your torso upright, until your thighs are at least parallel to the floor.",
      "Drive through the middle of your feet to stand back up, and repeat for the desired number of repetitions."
    ]
  },
  "smith-machine-good-morning": {
    "description": "A hip hinge with the Smith machine bar resting on the upper back, bending forward at the hips against a fixed bar path to load the hamstrings and the spinal erectors.",
    "equipment": "smith machine",
    "primary": [
      "erector_spinae",
      "hamstrings"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Set the bar at upper-back height, step under it and settle it across your traps, then unrack it with your feet about hip-width apart.",
      "Soften your knees slightly and keep them there -- this is a hinge, not a squat.",
      "Push your hips straight back and let your torso tip forward, keeping your back flat and your head in line with your spine.",
      "Stop when you feel a strong stretch in your hamstrings, with your torso somewhere near parallel to the floor.",
      "Drive your hips forward to stand back up, squeezing the glutes at the top, and repeat for the desired reps."
    ]
  },
  "smith-machine-hip-thrust": {
    "description": "A hip thrust with the bar running in the Smith machine guides, so the load travels in a fixed vertical line across the hips while the shoulders stay supported on a bench.",
    "equipment": "smith machine",
    "primary": [
      "gluteus_maximus",
      "gluteus_medius"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Set a flat bench inside the Smith machine, parallel to the bar and positioned so the bar will sit over your hip crease.",
      "Set the bar low enough that you can get under it while seated on the floor, then sit with your upper back against the bench.",
      "Roll the bar over your hips, pad it if you need to, and unhook it with your feet flat and about hip-width apart.",
      "Drive through your heels and extend your hips until your thighs and torso form a straight line, squeezing the glutes at the top.",
      "Lower your hips under control until they are just off the floor, and repeat for the desired number of repetitions."
    ]
  },
  "smith-machine-incline-bench-press": {
    "description": "An incline press in the Smith machine, guiding the bar to target the upper chest and front delts.",
    "equipment": "smith machine",
    "primary": [
      "anterior_deltoid",
      "pectoralis_major"
    ],
    "secondary": [
      "triceps_brachii"
    ],
    "instructions": [
      "Set an incline bench at 30-45 degrees inside a Smith machine.",
      "Lie back and grip the bar slightly wider than shoulder-width.",
      "Unrack and lower the bar to your upper chest.",
      "Pause briefly at the bottom.",
      "Press the bar back up until your arms are extended.",
      "Repeat for the desired number of reps."
    ]
  },
  "smith-machine-rdl": {
    "description": "A Romanian deadlift performed on a Smith machine, fixing the bar path so you can focus on the hip hinge and posterior-chain stretch.",
    "equipment": "smith machine",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_maximus",
      "trapezius"
    ],
    "instructions": [
      "Set the Smith machine bar at mid-thigh height and stand directly underneath with feet hip-width.",
      "Unrack the bar with an overhand grip just outside the hips.",
      "Push the hips back while letting the bar slide down the front of the legs.",
      "Go until you feel a deep hamstring stretch, with a flat back and a soft knee bend.",
      "Drive the hips forward to return to standing, keeping the bar close to the body.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "smith-machine-reverse-grip-bent-over-row": {
    "description": "An underhand-grip row performed in the Smith machine, biasing the lower lats and biceps on a guided bar path.",
    "equipment": "smith machine",
    "primary": [
      "biceps_brachii",
      "latissimus_dorsi"
    ],
    "secondary": [
      "erector_spinae",
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Stand inside a Smith machine and grip the bar with an underhand grip.",
      "Hinge forward at the hips until your torso is about 45 degrees.",
      "Keep your back flat and core braced.",
      "Pull the bar toward your lower abdomen.",
      "Squeeze your lats and shoulder blades at the top.",
      "Lower the bar under control and repeat."
    ]
  },
  "smith-machine-reverse-lunge": {
    "description": "A reverse lunge under a Smith machine bar, stepping one foot back into the lunge and returning it to standing each repetition while the guided bar holds the load steady.",
    "equipment": "smith machine",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Set the bar so it sits across your upper traps when you stand, then unrack it with your feet under your hips.",
      "Step one foot straight back and lower the rear knee toward the floor, keeping the front shin vertical and most of your weight on the front foot.",
      "Stop when the rear knee is just short of the floor and the front thigh is roughly parallel to it.",
      "Push through the front heel and bring the rear foot back to standing under the bar.",
      "Complete all the repetitions on one side, or alternate legs, then switch."
    ]
  },
  "smith-machine-shoulder-press": {
    "description": "An overhead press in the Smith machine, with the guided bar path providing stability for the shoulders.",
    "equipment": "smith machine",
    "primary": [
      "anterior_deltoid",
      "lateral_deltoid"
    ],
    "secondary": [
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Sit on a bench positioned inside a Smith machine.",
      "Grip the bar slightly wider than shoulder-width at shoulder level.",
      "Unrack the bar and press it overhead until your arms are extended.",
      "Lower the bar back to shoulder level under control.",
      "Keep your core tight throughout.",
      "Repeat for the desired number of reps."
    ]
  },
  "smith-machine-shrug": {
    "description": "A Smith machine isolation exercise elevating the shoulders to target the trapezius with a fixed bar path.",
    "equipment": "smith machine",
    "primary": [
      "trapezius"
    ],
    "secondary": [
      "forearm_flexors"
    ],
    "instructions": [
      "Stand upright inside a Smith machine with the bar at thigh height.",
      "Grip the bar slightly wider than shoulder-width with an overhand grip.",
      "Unrack the bar and let it hang in front of your thighs.",
      "Shrug your shoulders straight up toward your ears.",
      "Hold the top for a moment, then lower slowly.",
      "Repeat for the desired number of reps."
    ]
  },
  "smith-machine-split-squat": {
    "description": "A stationary split squat under a Smith machine bar, with the rear foot resting on the floor rather than a bench, so the guided path takes balance out of a single-leg movement.",
    "equipment": "smith machine",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Set the bar low enough that it will still clear your shoulders at the bottom of the rep, then step under it and rest it across your upper traps.",
      "Unrack the bar and take a long stride forward with one foot, leaving the rear foot planted on the floor with the heel lifted.",
      "Check that your front shin will stay roughly vertical when you descend; adjust the stride length before you start loading it.",
      "Lower straight down by bending both knees until the rear knee is just above the floor and the front thigh is close to parallel.",
      "Drive through the front heel to return to the start, keeping both feet in place, and repeat for the desired reps before switching sides."
    ]
  },
  "smith-machine-squat": {
    "description": "A squat performed on the Smith machine, using the fixed bar path for added stability while training quads and glutes.",
    "equipment": "smith machine",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Set the Smith machine bar at shoulder height and step under it.",
      "Position the bar across your upper traps and unrack it.",
      "Stand with feet shoulder-width apart, slightly forward of the bar.",
      "Descend until your thighs are parallel to the floor.",
      "Drive through your heels to return to standing.",
      "Repeat for the desired number of reps."
    ]
  },
  "smith-machine-upright-row": {
    "description": "An upright row on the Smith machine, pulling the guided bar up the front of the torso with the elbows leading, to work the side deltoids and the upper traps.",
    "equipment": "smith machine",
    "primary": [
      "lateral_deltoid",
      "trapezius"
    ],
    "secondary": [
      "anterior_deltoid",
      "biceps_brachii"
    ],
    "instructions": [
      "Set the bar at hip height, take an overhand grip a little wider than shoulder-width and stand close to it with your arms straight.",
      "Unrack the bar and stand tall with your shoulders back and your core braced.",
      "Pull the bar straight up the front of your body, leading with your elbows and keeping the bar close.",
      "Stop when the bar reaches your lower chest and your elbows are level with your shoulders, then pause briefly.",
      "Lower the bar under control until your arms are straight again, and repeat for the desired reps."
    ]
  },
  "snatch": {
    "description": "An Olympic lift pulling a barbell from the floor to overhead in one motion, caught in an overhead squat.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps",
      "trapezius"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings",
      "lateral_deltoid"
    ],
    "instructions": [
      "Stand with feet hip-width apart and grip the bar wide.",
      "Hinge down, keeping your back flat and chest up.",
      "Explosively extend hips, knees, and ankles to drive the bar up.",
      "Pull yourself under the bar into an overhead squat.",
      "Stand up with the bar locked out overhead.",
      "Return the bar to the floor and repeat."
    ]
  },
  "sphinx-pose": {
    "description": "A gentle prone backbend on the forearms: the elbows stay under the shoulders and the chest lifts, so the lower back extends without any strain from the arms.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae"
    ],
    "secondary": [
      "hip_flexors",
      "pectoralis_major"
    ],
    "instructions": [
      "Lie face down and place the forearms on the floor with the elbows directly under the shoulders.",
      "Press the forearms and the tops of the feet down and lift the chest.",
      "Draw the shoulders away from the ears and lengthen the back of the neck.",
      "Hold the position for the prescribed time, breathing into the front of the chest.",
      "Lower the chest to the floor and rest."
    ]
  },
  "spider-curl": {
    "description": "A curl lying face-down on an incline bench with arms hanging vertical, isolating the biceps through a strict range.",
    "equipment": "dumbbell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis"
    ],
    "instructions": [
      "Lie face down on an incline bench with arms hanging straight down.",
      "Hold a dumbbell in each hand with an underhand grip.",
      "Keep your upper arms vertical as you curl the weights up.",
      "Squeeze the biceps hard at the top.",
      "Lower the dumbbells under control to full extension.",
      "Repeat for the desired number of reps."
    ]
  },
  "split-jerk": {
    "description": "An overhead lift driving the barbell up with a leg dip and receiving it in a split stance with locked arms.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_maximus",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Hold the barbell across your front rack with elbows high.",
      "Dip straight down by bending your knees slightly.",
      "Explosively drive the bar overhead with your legs and arms.",
      "Split your feet forward and back as the bar locks out.",
      "Stand up by bringing your feet back together under the bar.",
      "Lower the bar and repeat."
    ]
  },
  "split-squat": {
    "description": "A stationary lunge lowering straight down in a split stance, building single-leg strength without a step.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand in a split stance with one foot forward and one back.",
      "Keep your torso upright and core braced.",
      "Lower your hips straight down by bending both knees.",
      "Stop when the back knee is just above the floor.",
      "Drive through the front heel to return to the start.",
      "Complete reps on one side, then switch."
    ]
  },
  "spoto-press": {
    "description": "A bench press variation pausing the bar just above the chest to build control and pressing power.",
    "equipment": "barbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on a flat bench and grip the barbell slightly wider than shoulders.",
      "Unrack the bar and hold it over your chest with arms extended.",
      "Lower the bar until it is one inch above your chest.",
      "Pause there for a full second without touching the chest.",
      "Press the bar back up until your arms are extended.",
      "Repeat for the desired number of reps."
    ]
  },
  "squat": {
    "description": "A compound lower-body movement targeting the quadriceps, glutes, and hamstrings.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings"
    ],
    "instructions": [
      "Position the bar on your upper traps.",
      "Unrack and step back, feet shoulder-width apart.",
      "Brace your core and squat down until thighs are parallel.",
      "Drive through your heels to stand back up.",
      "Repeat."
    ]
  },
  "stability-ball-hip-bridge": {
    "description": "A glute bridge with the feet on a stability ball, adding an anti-rotation and balance demand to the basic bridge pattern.",
    "equipment": "stability ball",
    "primary": [
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings",
      "rectus_abdominis"
    ],
    "instructions": [
      "Lie face-up on the floor and place both feet on top of a stability ball.",
      "Arms rest at the sides on the floor for balance.",
      "Squeeze the glutes and press the heels into the ball to raise the hips.",
      "Finish with a straight line from shoulders to knees.",
      "Lower the hips under control without the ball rolling away.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "stability-ball-knee-tuck": {
    "description": "A plank-position knee tuck with the feet on a stability ball, rolling the ball in under the hips to load the abs dynamically.",
    "equipment": "stability ball",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "anterior_deltoid",
      "hip_flexors",
      "obliques",
      "serratus_anterior"
    ],
    "instructions": [
      "Start in a high plank with both shins or the tops of the feet on top of a stability ball.",
      "Hands are under the shoulders, body in a straight line.",
      "Brace the core and pull the ball toward the chest by tucking the knees in.",
      "Roll it back out by extending the legs fully back to the plank position.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "stability-ball-push-up": {
    "description": "A push-up performed with the feet on a stability ball, adding a strong anti-rotation demand to a standard push-up.",
    "equipment": "stability ball",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "rectus_abdominis",
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Kneel in front of a stability ball and place your shins or feet on top of it.",
      "Set the hands on the floor under the shoulders in a high-plank position.",
      "Brace the core hard — the ball will want to roll sideways.",
      "Lower the chest to the floor by bending the elbows.",
      "Press back up to the starting position without letting the ball wobble.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "stability-ball-push-up-hands-on-ball": {
    "description": "An incline push-up performed with both hands on a stability ball and the feet on the floor. The unstable surface forces the chest, shoulders, and triceps to work harder while the core fights to keep the body rigid.",
    "equipment": "stability ball",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "rectus_abdominis",
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Place both hands on top of a stability ball and walk your feet back into a straight-arm plank, body in a straight line from head to heels.",
      "Brace your core and keep the ball steady beneath your hands.",
      "Bend your elbows to lower your chest toward the ball under control.",
      "Press back up to full arm extension without letting the ball roll.",
      "Repeat for the desired number of reps."
    ]
  },
  "stability-ball-wall-squat": {
    "description": "A bodyweight squat with a stability ball pinned between the lower back and a wall, keeping the spine guided.",
    "equipment": "stability ball",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Place a stability ball between your lower back and a wall.",
      "Step the feet forward about a foot, slightly wider than shoulder-width.",
      "Squat down, letting the ball roll up the back as you descend.",
      "Stop when thighs are parallel to the floor.",
      "Drive through the heels to stand back up."
    ]
  },
  "stair-climber": {
    "description": "A cardio machine movement that climbs a revolving staircase step after step, loading the glutes and quads continuously with no landing impact.",
    "equipment": "stair climber",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gastrocnemius",
      "gluteus_medius",
      "hamstrings",
      "soleus"
    ],
    "instructions": [
      "Step onto the bottom stair with the machine at its slowest setting and take the rails lightly for balance.",
      "Climb one step at a time, placing the whole foot on each stair rather than just the toes.",
      "Stand upright with your chest open and your hips under your shoulders instead of hunching over the console.",
      "Push the step down through the heel of the front foot, letting the glute of that leg do the work.",
      "Set the pace so you can hold your posture, and keep climbing for the desired time or number of floors."
    ]
  },
  "standing-calf-raise": {
    "description": "A calf raise performed standing to develop the gastrocnemius through a full range of motion.",
    "equipment": "standing calf raise machine",
    "primary": [
      "gastrocnemius"
    ],
    "secondary": [
      "soleus"
    ],
    "instructions": [
      "Stand on the edge of a platform or calf raise machine.",
      "Lower heels below the platform.",
      "Push up onto your toes.",
      "Lower slowly.",
      "Repeat."
    ]
  },
  "standing-calf-stretch": {
    "description": "A staggered-stance stretch that lengthens the calf by pressing the rear heel down with the back leg straight.",
    "equipment": "bodyweight",
    "primary": [
      "gastrocnemius"
    ],
    "secondary": [
      "soleus"
    ],
    "instructions": [
      "Step one foot back into a staggered stance.",
      "Keep the back leg straight and the heel pressed down.",
      "Bend the front knee and lean your weight forward.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "standing-forward-fold": {
    "description": "A standing stretch that lengthens the hamstrings and lower back by folding the torso over straight legs.",
    "equipment": "bodyweight",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "gastrocnemius"
    ],
    "instructions": [
      "Stand tall with your feet hip-width apart and legs straight.",
      "Hinge at your hips and fold your torso down toward the floor.",
      "Let your hands and head hang toward your feet.",
      "Hold for 20 to 30 seconds, breathing steadily."
    ]
  },
  "standing-forward-fold-to-half-lift": {
    "description": "The familiar half-lift articulation: from a standing forward fold the chest lifts to a flat back with the spine long, then folds again. It teaches the difference between a rounded fold and a long-spine hinge.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "hamstrings"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Stand with the feet hip-width apart and fold forward from the hips.",
      "Rest the hands on the shins, the floor or blocks.",
      "Slide the hands up the shins and lift the chest until the back is flat and the spine is long.",
      "Fold back down, letting the head and neck release.",
      "Continue alternating between the two for the desired number of repetitions."
    ]
  },
  "standing-quad-stretch": {
    "description": "A standing balance stretch that lengthens the quadriceps by pulling the heel toward the glute.",
    "equipment": "bodyweight",
    "primary": [
      "quadriceps"
    ],
    "secondary": [
      "hip_flexors"
    ],
    "instructions": [
      "Stand on one leg, holding a wall for balance if needed.",
      "Bend the other knee and grab that ankle behind you.",
      "Pull the heel toward your glute, keeping knees together.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "standing-side-bend": {
    "description": "A standing stretch that lengthens the obliques and lats by reaching overhead and bending to one side.",
    "equipment": "bodyweight",
    "primary": [
      "obliques"
    ],
    "secondary": [
      "latissimus_dorsi",
      "quadratus_lumborum"
    ],
    "instructions": [
      "Stand with feet hip-width and reach both arms overhead.",
      "Clasp your hands and lengthen up tall.",
      "Bend smoothly to one side in a long curve.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "standing-side-bend-flow": {
    "description": "A standing lateral flow: the arms reach overhead and the trunk bends from side to side in a controlled rhythm, lengthening the side body without holding either end position.",
    "equipment": "bodyweight",
    "primary": [
      "obliques"
    ],
    "secondary": [
      "latissimus_dorsi",
      "quadratus_lumborum"
    ],
    "instructions": [
      "Stand with the feet hip-width apart and reach both arms overhead.",
      "Bend the trunk to one side, keeping both feet planted and the hips level.",
      "Return through the centre with the ribs stacked over the pelvis.",
      "Bend to the other side in the same way.",
      "Keep alternating for the desired number of repetitions."
    ]
  },
  "standing-split": {
    "description": "A standing forward fold with one leg lifted behind: the torso folds over the standing leg while the free leg reaches towards the ceiling.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "quadriceps"
    ],
    "instructions": [
      "From a forward fold, place both hands on the floor or on blocks beside the standing foot.",
      "Shift the weight onto one leg and lift the other leg behind you.",
      "Keep the standing leg straight and the hips as level as the lift allows.",
      "Hold the position for the prescribed time, drawing the chest towards the standing shin.",
      "Lower the lifted foot down and repeat on the other side."
    ]
  },
  "stationary-bike": {
    "description": "A seated cardio machine movement that drives a flywheel through a continuous pedalling cycle, training the legs with no impact through the joints.",
    "equipment": "stationary bike",
    "primary": [
      "quadriceps"
    ],
    "secondary": [
      "gastrocnemius",
      "gluteus_maximus",
      "hamstrings",
      "soleus"
    ],
    "instructions": [
      "Set the saddle height so your knee stays slightly bent at the bottom of the pedal stroke, then sit down and place the balls of your feet on the pedals.",
      "Take the handlebars with a relaxed grip and sit tall, with your back neutral and your shoulders down.",
      "Push one pedal down and forward while the other rises, keeping the effort in your legs rather than pulling on the bars.",
      "Keep pedalling in a smooth, even circle at a steady cadence, breathing in rhythm with the stroke.",
      "Adjust the resistance to hold your target effort, and continue for the desired time or distance."
    ]
  },
  "step-ups": {
    "description": "A lower-body exercise stepping onto a bench, building strength in the quads and glutes.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gastrocnemius",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand facing a sturdy box or bench.",
      "Place one foot fully on the box surface.",
      "Drive through that heel to lift your body onto the box.",
      "Bring your trailing foot up to stand fully on the box.",
      "Step back down leading with the same foot.",
      "Alternate legs or complete all reps on one side before switching."
    ]
  },
  "stiff-leg-deadlift": {
    "description": "A hip hinge with nearly straight legs, lowering the bar along the thighs to stretch and load the hamstrings.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "trapezius"
    ],
    "instructions": [
      "Stand with feet hip-width apart, holding a barbell in front of your thighs.",
      "Keep your legs nearly straight with only a slight knee bend.",
      "Hinge at the hips and lower the bar along your legs.",
      "Go as low as your hamstring flexibility allows with a flat back.",
      "Drive through your heels to return upright.",
      "Repeat for the desired number of reps."
    ]
  },
  "straight-arm-pulldown": {
    "description": "An isolation exercise for the lats using a cable with arms kept straight.",
    "equipment": "cable",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "posterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand facing a cable machine with a straight bar attached to the high pulley.",
      "With arms nearly straight, push the bar down in an arc toward your thighs.",
      "Squeeze your lats at the bottom.",
      "Slowly return the bar to the starting position.",
      "Repeat."
    ]
  },
  "straight-bar-cable-front-raise": {
    "description": "A front raise on a low cable pulley with a straight bar attachment held in both hands. Unlike the one-armed cable front raise, both arms drive the same bar, and the cable keeps tension on the front delts through the whole range.",
    "equipment": "cable",
    "primary": [
      "anterior_deltoid"
    ],
    "secondary": [
      "lateral_deltoid",
      "pectoralis_major"
    ],
    "instructions": [
      "Attach a straight bar to a low cable pulley and stand facing away from the machine with the cable running forward past your legs.",
      "Hold the bar with an overhand grip, hands about shoulder-width apart, arms hanging straight down in front of your thighs.",
      "Keep the elbows almost straight and the core braced so the torso does not lean back.",
      "Raise the bar forward in a smooth arc until it reaches shoulder height.",
      "Lower it under control back to the thighs and repeat for the desired number of repetitions."
    ]
  },
  "straight-bar-dips": {
    "description": "A dip variation performed hanging from a straight pull-up bar instead of parallel dip bars, pressing the body up through a small range of motion.",
    "equipment": "pull up bar",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "triceps_brachii"
    ],
    "instructions": [
      "Grip a straight overhead bar with both hands, hanging with arms extended and feet off the floor.",
      "Keeping your body straight, press down through the bar to raise your shoulders and chest.",
      "Pause briefly at the top of the movement.",
      "Lower back down under control to the hanging position.",
      "Repeat for the desired number of reps."
    ]
  },
  "strict-curl": {
    "description": "A standing curl performed without any body English — the torso stays still and the elbows stay pinned, so the biceps do all the work.",
    "equipment": "dumbbell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis",
      "forearm_flexors"
    ],
    "instructions": [
      "Stand tall with a dumbbell in each hand, arms at your sides and palms facing forward.",
      "Pin your elbows against your sides and brace your core so your torso cannot swing.",
      "Curl both dumbbells up by bending only at the elbows.",
      "Lower them under control until your arms are straight.",
      "Repeat for the desired number of reps."
    ]
  },
  "suitcase-carry": {
    "description": "A loaded walk with the weight in one hand only, so the trunk has to resist bending toward the load for the whole distance — the unilateral counterpart to the farmer's walk.",
    "equipment": "kettlebell",
    "primary": [
      "forearm_flexors",
      "obliques",
      "quadratus_lumborum"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius",
      "quadriceps",
      "trapezius"
    ],
    "instructions": [
      "Stand beside a single kettlebell or dumbbell with your feet under your hips.",
      "Hinge at the hips, take the handle in one hand and stand up with the weight hanging at your side.",
      "Pull that shoulder down and back, and brace as if you were about to be pushed sideways.",
      "Walk forward with normal, even strides, keeping your torso upright and square rather than leaning away from the weight.",
      "Keep the free arm relaxed at your side instead of sticking it out as a counterweight.",
      "Carry for the desired distance or time, set the weight down under control, then repeat on the other side."
    ]
  },
  "sumo-deadlift": {
    "description": "A deadlift variation with a wide stance that shifts emphasis to the glutes, quads, and inner thighs.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "hamstrings"
    ],
    "instructions": [
      "Stand with feet wider than shoulder-width, toes pointed outward.",
      "Grip the bar between your legs.",
      "Brace your core and drive through your heels to stand.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "sumo-squat": {
    "description": "A barbell squat performed with a wide stance and turned-out toes, emphasizing the glutes and quads.",
    "equipment": "barbell",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand with feet wider than shoulder-width and toes turned out.",
      "Hold a barbell across your upper back.",
      "Brace your core and keep your chest up.",
      "Bend at the hips and knees to lower into a deep squat.",
      "Drive through your heels to stand back up.",
      "Repeat for the desired number of reps."
    ]
  },
  "superman": {
    "description": "A bodyweight lower-back exercise performed prone, lifting arms and legs simultaneously.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Lie face down with arms extended overhead.",
      "Simultaneously lift your arms, chest, and legs off the floor.",
      "Hold briefly at the top.",
      "Lower under control.",
      "Repeat."
    ]
  },
  "supine-spinal-twist": {
    "description": "A lying twist that stretches the lower back, glutes and obliques by dropping a bent knee across the body.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "obliques"
    ],
    "secondary": [
      "gluteus_maximus"
    ],
    "instructions": [
      "Lie on your back and bend one knee toward your chest.",
      "Guide that knee across your body toward the floor.",
      "Stretch your arms out wide and turn your head away.",
      "Hold for 20 to 30 seconds, breathing steadily.",
      "Switch sides and repeat."
    ]
  },
  "supine-windshield-wipers": {
    "description": "A lying rotation drill: with the knees bent or the legs raised, both legs swing from side to side like wipers while the shoulders stay pinned to the floor.",
    "equipment": "bodyweight",
    "primary": [
      "obliques",
      "rectus_abdominis"
    ],
    "secondary": [
      "hip_flexors",
      "transverse_abdominis"
    ],
    "instructions": [
      "Lie on your back with the arms out to the sides and the knees bent over the hips.",
      "Brace the trunk so the lower back does not lift off the floor.",
      "Lower both legs together towards one side as far as the shoulders stay down.",
      "Bring them back through the centre and lower to the other side.",
      "Keep alternating for the desired number of repetitions."
    ]
  },
  "supported-shoulderstand": {
    "description": "An inversion resting on the shoulders and upper arms with the hands supporting the back, the body stacked vertically over the shoulders.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "rectus_abdominis"
    ],
    "secondary": [
      "gluteus_maximus",
      "trapezius"
    ],
    "instructions": [
      "Lie on your back, ideally with a folded blanket under the shoulders and the head off it.",
      "Lift the legs overhead and support the lower back with both hands, elbows shoulder-width apart.",
      "Walk the hands up the back and stack the hips over the shoulders until the body is vertical.",
      "Hold the position for the prescribed time, keeping the head and neck completely still.",
      "Lower the legs overhead and roll down slowly with the hands supporting the back."
    ]
  },
  "svend-press": {
    "description": "A plate-squeeze press that loads the pecs through isometric adduction as you extend the weight away from the chest.",
    "equipment": "plates",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand upright holding a single weight plate (or two pressed together) between your palms at chest height.",
      "Squeeze the plates hard to generate tension through the pecs.",
      "Press the plates straight out in front of you until the arms are fully extended.",
      "Pause briefly, keeping the squeeze, then return the plates to the chest.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "t-bar-row": {
    "description": "A compound row performed straddling a loaded T-bar, building thickness in the lats and rhomboids.",
    "equipment": "barbell",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "erector_spinae",
      "trapezius"
    ],
    "instructions": [
      "Straddle the loaded T-bar with feet shoulder-width apart.",
      "Hinge at the hips until your torso is around 45 degrees.",
      "Grip the handles and keep your back flat.",
      "Pull the bar up toward your chest by driving your elbows back.",
      "Squeeze your shoulder blades at the top.",
      "Lower the bar under control and repeat."
    ]
  },
  "thoracic-bridge": {
    "description": "A mobility hold that lifts the hips from a tabletop position and opens the chest, extending the thoracic spine while the glutes and shoulders hold the bridge.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "gluteus_maximus"
    ],
    "secondary": [
      "posterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Sit on the floor with knees bent and hands behind you, fingers pointing back.",
      "Press through your hands and feet to lift your hips off the floor.",
      "Continue pressing until your chest opens and your arms are extended.",
      "Drop your head back and hold the position.",
      "Breathe steadily while maintaining the bridge.",
      "Lower back down under control."
    ]
  },
  "thread-the-needle": {
    "description": "A kneeling rotation: one arm slides under the body and the shoulder and side of the head rest on the floor, rotating the thoracic spine passively.",
    "equipment": "bodyweight",
    "primary": [
      "posterior_deltoid",
      "trapezius"
    ],
    "secondary": [
      "erector_spinae",
      "obliques"
    ],
    "instructions": [
      "Start on all fours with the hands under the shoulders and the knees under the hips.",
      "Slide one arm underneath the body, palm facing up, until the shoulder and the side of the head rest on the mat.",
      "Keep the hips stacked over the knees and walk the top hand forward or wrap it behind the back.",
      "Hold the twist for the prescribed time, breathing into the upper back.",
      "Press the top hand into the floor to come up and repeat on the other side."
    ]
  },
  "thread-the-needle-flow": {
    "description": "The moving version of thread the needle: from all fours the arm threads under the body and then opens back up towards the ceiling, rotating the thoracic spine through its full range.",
    "equipment": "bodyweight",
    "primary": [
      "obliques",
      "trapezius"
    ],
    "secondary": [
      "erector_spinae",
      "posterior_deltoid"
    ],
    "instructions": [
      "Start on all fours with the hands under the shoulders and the knees under the hips.",
      "Slide one arm under the body until the shoulder approaches the mat.",
      "Reverse the motion and open that arm up towards the ceiling, following the hand with the eyes.",
      "Return through the centre and repeat for the desired number of repetitions.",
      "Change sides and repeat."
    ]
  },
  "three-legged-dog": {
    "description": "Downward dog with one leg lifted: the shoulders carry more load while the lifted leg extends in line with the spine and the hips stay square.",
    "equipment": "bodyweight",
    "primary": [
      "anterior_deltoid",
      "gluteus_maximus"
    ],
    "secondary": [
      "hamstrings",
      "trapezius"
    ],
    "instructions": [
      "Set up in downward dog with the hands shoulder-width apart and the hips high.",
      "Press both hands evenly into the floor and shift the weight slightly forward.",
      "Lift one leg behind you until it is in line with the spine, keeping both hip points level.",
      "Hold the position for the prescribed time with the standing heel reaching down.",
      "Lower the leg and repeat on the other side."
    ]
  },
  "thruster": {
    "description": "A full-body barbell movement combining a front squat with an overhead press in one fluid drive.",
    "equipment": "barbell",
    "primary": [
      "anterior_deltoid",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_maximus",
      "trapezius",
      "triceps_brachii"
    ],
    "instructions": [
      "Hold a barbell in a front rack position with elbows high.",
      "Stand with feet shoulder-width apart.",
      "Squat down to parallel while keeping your torso upright.",
      "Drive up out of the squat and press the bar overhead in one motion.",
      "Lock out your arms at the top with the bar overhead.",
      "Lower the bar back to the front rack and repeat."
    ]
  },
  "toes-to-bar": {
    "description": "An advanced hanging core exercise on a pull-up bar requiring hip flexion strength and lat engagement to touch the toes to the bar.",
    "equipment": "pull up bar",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "forearm_flexors",
      "latissimus_dorsi",
      "obliques"
    ],
    "instructions": [
      "Hang from a pull-up bar with an overhand grip, arms fully extended and body still.",
      "Engage your lats and core to prevent swinging.",
      "Raise your legs with straight knees, reaching your toes up toward the bar.",
      "Touch the bar with your toes, then lower your legs under control.",
      "Repeat for the desired reps."
    ]
  },
  "treadmill-running": {
    "description": "A running cardio movement performed on a motorised belt, holding a chosen pace and distance indoors with the surface and gradient under your control.",
    "equipment": "treadmill",
    "primary": [
      "gastrocnemius",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_maximus",
      "hamstrings",
      "hip_flexors",
      "soleus"
    ],
    "instructions": [
      "Step onto the treadmill with a foot on each side rail, start the belt at a walking speed and step on once it is moving.",
      "Build up to your running pace, landing under your hips rather than reaching out in front of you.",
      "Run tall with your shoulders relaxed, your elbows bent at about ninety degrees and your arms swinging forward and back, not across your body.",
      "Keep your eyes forward and stay in the middle of the belt instead of drifting back toward the rear roller.",
      "Hold the pace for the desired time or distance, then slow the belt and walk for a few minutes before stepping off."
    ]
  },
  "tree-pose": {
    "description": "A one-legged standing balance with the sole of the free foot placed on the inner calf or thigh and the hips level.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_medius",
      "quadriceps"
    ],
    "secondary": [
      "erector_spinae",
      "soleus"
    ],
    "instructions": [
      "Stand tall and shift the weight onto one foot.",
      "Place the sole of the other foot on the inner calf or the inner thigh, avoiding the knee.",
      "Press the foot and the leg into each other and level the hips.",
      "Bring the hands to the chest or overhead and hold for the prescribed time.",
      "Lower the foot and repeat on the other side."
    ]
  },
  "triangle-pose": {
    "description": "A wide-stance pose with both legs straight and the torso tilting sideways over the front leg, lengthening the hamstring and the whole side body.",
    "equipment": "bodyweight",
    "primary": [
      "hamstrings",
      "obliques"
    ],
    "secondary": [
      "adductors",
      "gluteus_medius"
    ],
    "instructions": [
      "Stand wide with the front foot turned out and the back foot angled slightly in.",
      "Keep both legs straight and reach the front hand forward as the hips shift back.",
      "Tilt sideways and bring the bottom hand to the shin, a block or the floor, top arm reaching up.",
      "Hold the position for the prescribed time, turning the chest towards the ceiling.",
      "Press into the feet to come up and repeat on the other side."
    ]
  },
  "tricep-kickback": {
    "description": "An isolation exercise for the triceps performed in a bent-over position.",
    "equipment": "dumbbell",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Hinge forward at the hips, holding a dumbbell with elbow bent at 90 degrees.",
      "Extend your arm straight back, squeezing the tricep.",
      "Hold briefly at full extension.",
      "Lower with control.",
      "Repeat on both sides."
    ]
  },
  "tricep-pushdown": {
    "description": "An isolation exercise targeting the triceps using a cable machine.",
    "equipment": "cable",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Stand facing a cable machine with a straight bar attachment.",
      "Grip the bar and pin your elbows to your sides.",
      "Push the bar down until your arms are fully extended.",
      "Slowly return to the starting position.",
      "Repeat."
    ]
  },
  "trx-bicep-curl": {
    "description": "This exercise uses a suspension trainer to isolate and strengthen the biceps brachii and brachialis muscles, building upper arm strength and hypertrophy.",
    "equipment": "suspension trainer",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis",
      "brachioradialis"
    ],
    "instructions": [
      "Adjust the suspension trainer straps to a medium length.",
      "Stand facing the anchor point, grasp the handles with an underhand grip, and lean back until your arms are fully extended.",
      "Keep your body straight and core engaged, pull your chest towards your hands by bending your elbows.",
      "Squeeze your biceps at the top of the movement.",
      "Slowly extend your arms back to the starting position, controlling the descent.",
      "Maintain tension throughout the set."
    ]
  },
  "trx-chest-press": {
    "description": "A compound push exercise using a suspension trainer to build chest strength and stability.",
    "equipment": "suspension trainer",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "rectus_abdominis",
      "triceps_brachii"
    ],
    "instructions": [
      "Adjust the suspension trainer handles to mid-calf height.",
      "Stand facing away from the anchor point, holding a handle in each hand, arms extended.",
      "Lean forward into a plank position, keeping your body straight from head to heels.",
      "Lower your chest towards your hands by bending your elbows, maintaining tension in the straps.",
      "Press back up to the starting position, fully extending your arms and squeezing your chest."
    ]
  },
  "trx-face-pull": {
    "description": "The TRX Face Pull is a compound pulling exercise targeting the posterior deltoids and rhomboids, using a suspension trainer to improve upper back strength and posture.",
    "equipment": "suspension trainer",
    "primary": [
      "posterior_deltoid",
      "rhomboids"
    ],
    "secondary": [
      "trapezius"
    ],
    "instructions": [
      "Grasp the TRX handles with an overhand grip, palms facing down.",
      "Lean back until your arms are fully extended and your body forms a straight line.",
      "Pull the handles towards your face, driving your elbows high and wide.",
      "Squeeze your shoulder blades together at the peak contraction.",
      "Slowly extend your arms back to the starting position with control."
    ]
  },
  "trx-hamstring-curl": {
    "description": "This isolation exercise uses a suspension trainer to target the hamstrings, glutes, and calves by curling the heels towards the glutes.",
    "equipment": "suspension trainer",
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "gastrocnemius",
      "gluteus_maximus"
    ],
    "instructions": [
      "Lie on your back with heels in the suspension trainer cradles, knees bent at 90 degrees.",
      "Lift your hips off the floor, creating a straight line from knees to shoulders.",
      "Extend your legs forward, maintaining hip elevation and core tension.",
      "Pull your heels back towards your glutes, contracting your hamstrings forcefully.",
      "Control the movement, avoiding any drop in hip height throughout the set."
    ]
  },
  "trx-lunge": {
    "description": "A beginner-friendly unilateral lower body exercise using a suspension trainer to target the quadriceps and glutes, while also engaging the hamstrings and gluteus medius for stability.",
    "equipment": "suspension trainer",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand facing away from the anchor point, holding the suspension trainer handles in front of you.",
      "Place one foot into both foot cradles, extending the leg behind you.",
      "Brace your core and lower your body by bending the front knee, keeping your torso upright.",
      "Descend until your front thigh is parallel to the floor or just below, maintaining tension on the suspension trainer.",
      "Drive through your front heel to return to the starting position, extending the front leg.",
      "Complete all reps on one side, then switch legs and repeat per side."
    ]
  },
  "trx-pistol-squat": {
    "description": "A challenging unilateral leg exercise using a suspension trainer to assist balance and depth, primarily targeting the quadriceps and glutes.",
    "equipment": "suspension trainer",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Anchor the suspension trainer and hold the handles with both hands, arms extended.",
      "Stand tall, lift one leg straight out in front of you, keeping it off the ground.",
      "Initiate the squat by pushing your hips back and bending the standing knee, lowering your body as deep as possible.",
      "Keep your chest up, back straight, and use the TRX for balance and support as needed.",
      "Drive through your heel to return to the starting position, extending the standing leg fully.",
      "Complete all reps on one side before switching to the other."
    ]
  },
  "trx-plank": {
    "description": "A plank variation with feet suspended in TRX straps, increasing instability and core demand.",
    "equipment": "suspension trainer",
    "primary": [
      "rectus_abdominis",
      "transverse_abdominis"
    ],
    "secondary": [
      "anterior_deltoid",
      "obliques"
    ],
    "instructions": [
      "Place both feet in the TRX foot cradles.",
      "Assume a forearm or high plank position on the floor.",
      "Keep your body in a straight line from head to heels.",
      "Brace your core and squeeze your glutes.",
      "Hold the position for the desired time.",
      "Lower your knees to exit safely."
    ]
  },
  "trx-row": {
    "description": "This bodyweight pulling exercise uses a suspension trainer to target your entire back, building strength in the lats, rhomboids, and biceps.",
    "equipment": "suspension trainer",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "trapezius"
    ],
    "instructions": [
      "Grasp the handles of a suspension trainer with an overhand grip, palms facing each other.",
      "Lean back, extending your arms fully, keeping your body straight from head to heels.",
      "Engage your core and pull your chest towards your hands, squeezing your shoulder blades together.",
      "Pause briefly at the top, then slowly lower yourself back to the starting position with control.",
      "Maintain a rigid body throughout the movement, avoiding any sagging in the hips."
    ]
  },
  "trx-side-plank": {
    "description": "A side plank with both feet suspended in TRX cradles, intensifying the demand on the obliques.",
    "equipment": "suspension trainer",
    "primary": [
      "obliques",
      "transverse_abdominis"
    ],
    "secondary": [
      "gluteus_medius",
      "lateral_deltoid"
    ],
    "instructions": [
      "Place both feet in the TRX foot cradles and lie on your side.",
      "Prop up on your bottom forearm with your elbow under your shoulder.",
      "Lift your hips so your body forms a straight line.",
      "Stack your top foot over the bottom foot.",
      "Hold the position while breathing steadily.",
      "Lower and switch sides after the set."
    ]
  },
  "trx-squat": {
    "description": "This bodyweight compound exercise utilizes a suspension trainer to assist in performing a squat, effectively targeting the quadriceps, glutes, and hamstrings for lower body strength and stability.",
    "equipment": "suspension trainer",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Stand facing the anchor point, holding the handles with palms facing each other, arms extended.",
      "Lean back slightly, keeping your body straight and core engaged, with feet shoulder-width apart.",
      "Initiate the squat by pushing your hips back and bending your knees, lowering your body as if sitting in a chair.",
      "Descend until your thighs are parallel to the floor or as deep as comfortable, maintaining tension on the straps.",
      "Drive through your heels to return to the starting position, extending your hips and knees fully."
    ]
  },
  "trx-tricep-extension": {
    "description": "This exercise targets the triceps brachii using a suspension trainer, focusing on elbow extension for upper arm development and strength.",
    "equipment": "suspension trainer",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Stand facing the anchor point, holding the TRX handles with an overhand grip, palms facing down.",
      "Lean forward, extending your arms straight out in front of you at shoulder height, creating tension in the straps.",
      "Keeping your elbows high and fixed, bend them to lower your body by letting your hands move towards your temples.",
      "Extend your elbows forcefully to push your body back to the starting position, squeezing your triceps.",
      "Maintain a rigid plank position throughout the movement, engaging your core and glutes."
    ]
  },
  "trx-y-fly": {
    "description": "This suspension trainer exercise targets the posterior deltoids and trapezius, improving shoulder health and posture by strengthening the upper back.",
    "equipment": "suspension trainer",
    "primary": [
      "posterior_deltoid",
      "trapezius"
    ],
    "secondary": [
      "lateral_deltoid",
      "rhomboids"
    ],
    "instructions": [
      "Stand facing the anchor point, holding the handles with an overhand grip, palms facing each other.",
      "Lean back, extending your arms straight in front of you, maintaining a plank position with your body.",
      "Initiate the movement by pulling your shoulder blades together and down, forming a 'Y' shape with your body.",
      "Keep your arms straight and elbows slightly bent, squeezing your shoulder blades at the top.",
      "Slowly control the descent back to the starting position, resisting the pull of the straps."
    ]
  },
  "upright-row": {
    "description": "A compound pulling movement for the lateral deltoids and upper traps.",
    "equipment": "barbell",
    "primary": [
      "lateral_deltoid",
      "trapezius"
    ],
    "secondary": [
      "anterior_deltoid",
      "biceps_brachii"
    ],
    "instructions": [
      "Stand holding a barbell with a shoulder-width overhand grip.",
      "Pull the bar straight up along your body toward your chin.",
      "Lead with your elbows, keeping them above your hands.",
      "Lower the bar with control.",
      "Repeat."
    ]
  },
  "upward-dog": {
    "description": "A prone backbend on straight arms with the thighs lifted off the floor, so the arms and back extensors hold the chest open and the spine long.",
    "equipment": "bodyweight",
    "primary": [
      "erector_spinae",
      "triceps_brachii"
    ],
    "secondary": [
      "gluteus_maximus",
      "pectoralis_major"
    ],
    "instructions": [
      "Lie face down with the hands beside the lower ribs and the tops of the feet on the floor.",
      "Press the hands down and straighten the arms, lifting the chest and then the thighs off the mat.",
      "Draw the shoulders back and down and keep the neck long.",
      "Hold the position for the prescribed time with only the hands and the tops of the feet on the floor.",
      "Bend the arms and lower down under control."
    ]
  },
  "v-bar-lat-pulldown": {
    "description": "A neutral-grip pulldown performed with a narrow V-handle, maximizing lat stretch and allowing a deeper contraction.",
    "equipment": "lat pulldown machine",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Attach a V-bar (double-D handle) to a lat pulldown cable.",
      "Sit with the thighs secured under the pad and grip the handle, palms facing each other.",
      "Begin with the arms fully extended overhead.",
      "Pull the handle down to the sternum by driving the elbows down and slightly back.",
      "Squeeze the lats at the bottom, then return slowly under control.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "v-bar-tricep-pushdown": {
    "description": "A cable tricep pushdown using a V-handle, which locks the wrists in a pronated, slightly-angled position and loads the lateral head.",
    "equipment": "cable",
    "primary": [
      "triceps_brachii"
    ],
    "secondary": [],
    "instructions": [
      "Attach a V-bar handle to a high cable pulley.",
      "Stand facing the stack and grip the V-bar with both hands, palms down.",
      "Start with the elbows tucked to the sides, forearms parallel to the floor.",
      "Press the handle down until the arms are fully extended.",
      "Squeeze the triceps, then return under control to the starting position.",
      "Repeat for the recommended number of repetitions."
    ]
  },
  "v-sit": {
    "description": "A static core hold balancing on the sit bones with the legs and torso lifted into a V, challenging the abdominals and hip flexors.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques",
      "quadriceps"
    ],
    "instructions": [
      "Sit on the floor with your legs extended in front of you.",
      "Lean back slightly and lift your legs off the floor.",
      "Reach your arms forward so your body forms a V shape.",
      "Balance on your sit bones with core tight.",
      "Hold the position while breathing steadily.",
      "Lower your legs and torso to exit."
    ]
  },
  "v-ups": {
    "description": "A dynamic core exercise raising the legs and torso together into a V shape, training the abs and hip flexors.",
    "equipment": "bodyweight",
    "primary": [
      "hip_flexors",
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques",
      "transverse_abdominis"
    ],
    "instructions": [
      "Lie flat on your back with arms extended overhead and legs straight.",
      "Simultaneously raise your legs and upper body toward each other.",
      "Reach your hands toward your feet at the top, forming a V shape.",
      "Keep your legs straight throughout the movement.",
      "Lower both ends under control back to the floor.",
      "Repeat for the desired number of reps."
    ]
  },
  "walking": {
    "description": "Unaided gait on level ground, keeping one foot in contact with the floor throughout, which makes it the lowest-impact way to accumulate aerobic work.",
    "equipment": "bodyweight",
    "primary": [
      "gastrocnemius",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_maximus",
      "hamstrings",
      "hip_flexors",
      "soleus"
    ],
    "instructions": [
      "Stand tall with your weight over the middle of your feet and your shoulders relaxed, not pulled back.",
      "Step forward and land on your heel, then roll through the foot and push off the ball and toes.",
      "Keep at least one foot on the ground at all times — as soon as both leave the floor you are running, not walking.",
      "Let your arms swing naturally from the shoulder, opposite arm to opposite leg, with the elbows softly bent.",
      "Look ahead rather than down at your feet, and breathe through a steady, repeatable rhythm.",
      "Continue for the desired time or distance, picking a pace at which you could still hold a conversation."
    ]
  },
  "walking-lunge": {
    "description": "A traveling lunge stepping forward leg over leg, training the quads and glutes with an added balance challenge.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "gluteus_medius",
      "hamstrings"
    ],
    "instructions": [
      "Stand tall with feet hip-width apart and hands on hips.",
      "Step one foot forward into a long lunge.",
      "Lower until both knees are around 90 degrees.",
      "Drive through the front heel and step the back foot forward.",
      "Continue alternating legs as you walk forward.",
      "Repeat for the desired number of reps."
    ]
  },
  "wall-push-ups": {
    "description": "A beginner-friendly push-up performed standing against a wall, reducing load on the chest and arms.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Stand facing a wall and place your palms on it at shoulder height.",
      "Step your feet back until your arms are fully extended.",
      "Bend your elbows to bring your chest toward the wall.",
      "Keep your body in a straight line throughout.",
      "Press back to the starting position.",
      "Repeat for the desired number of reps."
    ]
  },
  "wall-sit": {
    "description": "A static isometric exercise holding a squat position against a wall to build quad endurance.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "hamstrings"
    ],
    "instructions": [
      "Stand with back against a wall.",
      "Slide down until thighs are parallel to the floor.",
      "Hold the position.",
      "Stand back up when done."
    ]
  },
  "warrior-one": {
    "description": "A split-stance standing pose with the back foot planted at an angle, the front knee bent and the arms overhead, hips facing forward.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "quadriceps"
    ],
    "secondary": [
      "anterior_deltoid",
      "erector_spinae"
    ],
    "instructions": [
      "Step one foot back and turn it out about forty-five degrees, planting the whole sole.",
      "Bend the front knee until it stacks over the ankle and keep the back leg straight.",
      "Draw both hip points towards the front of the mat and lift the arms overhead.",
      "Hold the position for the prescribed time with the ribs down and the chest lifted.",
      "Step the feet together and repeat on the other side."
    ]
  },
  "warrior-three": {
    "description": "A single-leg balance with the torso and the lifted leg parallel to the floor, forming one long line from the fingertips to the raised heel.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_maximus",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "gluteus_medius"
    ],
    "instructions": [
      "Stand on one leg with the knee soft and the hips level.",
      "Hinge forward from the hips as the other leg lifts behind you.",
      "Continue until the torso and the lifted leg are roughly parallel to the floor.",
      "Reach the arms forward, back along the body or out to the sides, and hold for the prescribed time.",
      "Lower the leg and repeat on the other side."
    ]
  },
  "warrior-two": {
    "description": "A wide-stance pose with the front knee bent, the hips open to the side and the arms extended in line with the shoulders.",
    "equipment": "bodyweight",
    "primary": [
      "gluteus_medius",
      "quadriceps"
    ],
    "secondary": [
      "adductors",
      "lateral_deltoid"
    ],
    "instructions": [
      "Stand wide with the front foot turned out ninety degrees and the back foot slightly in.",
      "Bend the front knee until it stacks over the ankle and tracks towards the middle toes.",
      "Open the hips and chest to the side and extend the arms parallel to the floor.",
      "Hold the position for the prescribed time, gazing over the front hand.",
      "Straighten the front leg and repeat on the other side."
    ]
  },
  "weighted-dips": {
    "description": "A parallel-bar dip performed with extra load — most often a plate hung from a dip belt between the legs — to keep the movement in a strength rep range once bodyweight dips are easy.",
    "equipment": "dip station",
    "primary": [
      "pectoralis_major",
      "triceps_brachii"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Attach a plate to a dip belt around your waist so the weight hangs between your legs.",
      "Grip the parallel dip bars and press yourself up to the top position with your arms locked out and your feet off the floor.",
      "Lean your torso slightly forward and lower your body by bending your elbows until your shoulders are below them.",
      "Press back up through your palms until your arms are locked out again, keeping the hanging plate from swinging.",
      "Repeat for the desired number of reps."
    ]
  },
  "weighted-pull-up": {
    "description": "A pull-up performed with extra load — most often a plate hung from a dip belt between the legs — to keep the movement in a strength rep range once bodyweight pull-ups are easy.",
    "equipment": "pull up bar",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Attach a plate to a dip belt around your waist so the weight hangs between your legs, or hold the load between your feet.",
      "Grip the pull-up bar with an overhand grip slightly wider than shoulder-width and hang at full arm extension with your legs together.",
      "Pull your elbows down and back to drive your chest toward the bar until your chin clears it.",
      "Lower yourself under control back to the full dead hang, keeping tension on your lats and letting the weight settle before the next rep.",
      "Repeat for the desired number of reps."
    ]
  },
  "weighted-wall-crunch": {
    "description": "A crunch variation with the legs parked out of the way -- feet braced against a wall or box, or the legs simply held up -- so the hips stay quiet and the abs do the work.",
    "equipment": "plates",
    "primary": [
      "rectus_abdominis"
    ],
    "secondary": [
      "obliques"
    ],
    "instructions": [
      "Lie on your back and park your legs so your hips cannot help: brace your feet against a wall or a box, or hold your legs up with the knees bent.",
      "Hold a weight against your chest with both hands -- a plate, a dumbbell, or a kettlebell all work.",
      "Crunch up, lifting your shoulder blades off the floor.",
      "Lower with control.",
      "Repeat."
    ]
  },
  "wide-grip-bench-press": {
    "description": "A bench press variation with a wider-than-shoulder-width grip to maximize chest activation.",
    "equipment": "barbell",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "triceps_brachii"
    ],
    "instructions": [
      "Lie on a flat bench. Grip the barbell wider than shoulder-width.",
      "Lower the bar to mid-chest.",
      "Press back up to full extension.",
      "Repeat."
    ]
  },
  "wide-grip-pull-ups": {
    "description": "A pull-up performed with a wide overhand grip, emphasizing the lats and upper-back width.",
    "equipment": "pull up bar",
    "primary": [
      "latissimus_dorsi"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid",
      "rhomboids",
      "trapezius"
    ],
    "instructions": [
      "Grip the pull-up bar with an overhand grip wider than shoulder-width.",
      "Hang with arms fully extended and core braced.",
      "Pull your chest toward the bar by driving your elbows down.",
      "Keep your shoulders pulled back as you rise.",
      "Lower yourself under control to full extension.",
      "Repeat for the desired number of reps."
    ]
  },
  "wide-grip-push-ups": {
    "description": "A push-up variation with a wider hand placement to emphasize the chest.",
    "equipment": "bodyweight",
    "primary": [
      "pectoralis_major"
    ],
    "secondary": [
      "anterior_deltoid",
      "serratus_anterior",
      "triceps_brachii"
    ],
    "instructions": [
      "Start in a high plank with hands wider than shoulder-width.",
      "Keep your body in a straight line from head to heels.",
      "Lower your chest toward the floor by bending your elbows.",
      "Keep your core braced and glutes engaged.",
      "Press back up until your arms are extended.",
      "Repeat for the desired number of reps."
    ]
  },
  "wide-grip-seated-cable-row": {
    "description": "A seated rowing variation with a wide grip emphasizing the upper back.",
    "equipment": "cable",
    "primary": [
      "latissimus_dorsi",
      "rhomboids"
    ],
    "secondary": [
      "biceps_brachii",
      "posterior_deltoid"
    ],
    "instructions": [
      "Sit at a cable row station with feet on the platform.",
      "Grip a wide bar with an overhand grip.",
      "Pull the bar toward your upper abdomen, squeezing your shoulder blades.",
      "Extend your arms back to the starting position with control.",
      "Repeat."
    ]
  },
  "wide-legged-forward-fold": {
    "description": "A standing fold from a wide stance with the hands on the floor, lengthening the hamstrings and the inner thighs while the spine hangs long.",
    "equipment": "bodyweight",
    "primary": [
      "adductors",
      "hamstrings"
    ],
    "secondary": [
      "erector_spinae",
      "gastrocnemius"
    ],
    "instructions": [
      "Stand with the feet wide apart and the outer edges parallel.",
      "Place the hands on the hips, lift the chest and hinge forward from the hip joints.",
      "Bring the hands to the floor under the shoulders and let the head hang.",
      "Hold the fold for the prescribed time, shifting the weight slightly into the balls of the feet.",
      "Bring the hands back to the hips and come up with a flat back."
    ]
  },
  "wide-stance-leg-press": {
    "description": "A leg press with a wide, slightly turned-out stance that increases the contribution of the adductors alongside hip and knee extension while the back stays supported.",
    "equipment": "leg press",
    "primary": [
      "adductors"
    ],
    "secondary": [
      "gluteus_maximus",
      "hamstrings",
      "quadriceps"
    ],
    "instructions": [
      "Set the back pad and seat so your lower back remains supported at the bottom of the repetition.",
      "Place your feet wide on the platform with the toes turned out only as far as the knees can follow comfortably.",
      "Lower the sled by bending the hips and knees while keeping the knees aligned with the toes and the feet flat.",
      "Press through the whole foot and extend the hips and knees without forcing the knees into lockout.",
      "Lower the sled under control and repeat for the desired number of repetitions."
    ]
  },
  "wrist-curl": {
    "description": "A dumbbell wrist curl performed with both arms at once, isolating the forearm flexors for a time-efficient forearm session.",
    "equipment": "dumbbell",
    "primary": [
      "forearm_flexors"
    ],
    "secondary": [
      "brachioradialis"
    ],
    "instructions": [
      "Sit on a bench holding a dumbbell in each hand, forearms resting on your thighs, palms up.",
      "Let both dumbbells roll down to your fingertips.",
      "Curl both dumbbells up by flexing your wrists.",
      "Squeeze at the top, then lower under control.",
      "Repeat for the desired number of reps."
    ]
  },
  "wrist-roller": {
    "description": "A forearm exercise winding a hanging weight up and down a roller, building grip and wrist strength.",
    "equipment": "wrist roller",
    "primary": [
      "forearm_extensors",
      "forearm_flexors"
    ],
    "secondary": [
      "anterior_deltoid"
    ],
    "instructions": [
      "Grip the wrist roller handle with arms extended in front at shoulder height.",
      "Let the weight hang from the cord.",
      "Roll the handle forward with alternating wrist movements to wind the weight up.",
      "Keep your arms straight throughout.",
      "Once fully wound, reverse the rotation to lower the weight.",
      "Repeat for the desired number of reps."
    ]
  },
  "zottman-curl": {
    "description": "A standing dumbbell curl that lifts with a supinated grip, rotates to palms-down at the top, and lowers in pronation to combine biceps work with a forearm-heavy eccentric.",
    "equipment": "dumbbell",
    "primary": [
      "biceps_brachii"
    ],
    "secondary": [
      "brachialis",
      "brachioradialis",
      "forearm_extensors"
    ],
    "instructions": [
      "Stand with your feet about hip-width apart, arms extended at your sides, and a dumbbell in each hand with the palms facing forward.",
      "Keep your upper arms beside your ribs and curl both dumbbells toward your shoulders without swinging the torso.",
      "At the top, keep the elbows bent and rotate the forearms until the palms face down.",
      "Lower the dumbbells slowly with the pronated grip until the arms are straight.",
      "Turn the palms forward again at the bottom and repeat for the desired number of repetitions."
    ]
  }
};
