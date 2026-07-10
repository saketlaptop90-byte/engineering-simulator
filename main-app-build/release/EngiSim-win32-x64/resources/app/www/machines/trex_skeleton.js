export function createTrexSkeleton(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Base material for the skeleton
    const boneMaterial = new THREE.MeshStandardMaterial({
        color: 0xe3dac9, // Bone color
        roughness: 0.8,
        metalness: 0.1
    });

    // Helper function to create, position and register a part
    function addPart(id, name, geometry, x, y, z, description) {
        const mesh = new THREE.Mesh(geometry, boneMaterial);
        mesh.position.set(x, y, z);
        mesh.userData = { id, name };
        group.add(mesh);
        parts.push({ id, name, description });
        return mesh;
    }

    // 1. Skull
    const skullGeo = new THREE.BoxGeometry(1.5, 1, 2);
    const skull = addPart(
        'skull',
        'Skull',
        skullGeo,
        0, 5, 2,
        'The massive skull of the T-Rex, built extremely robustly to crush bone.'
    );

    // 2. Mandible (Lower Jaw)
    const mandibleGeo = new THREE.BoxGeometry(1.4, 0.4, 1.8);
    const mandible = addPart(
        'mandible',
        'Mandible',
        mandibleGeo,
        0, 4.3, 2.1,
        'The lower jawbone, housing incredibly strong muscles and serrated teeth.'
    );
    // Adjust the pivot point for the jaw to animate correctly
    mandible.geometry.translate(0, 0, 0.9);
    mandible.position.set(0, 4.3, 1.2);

    // 3. Cervical Vertebrae (Neck)
    const cervicalGeo = new THREE.CylinderGeometry(0.5, 0.6, 2, 8);
    cervicalGeo.rotateX(Math.PI / 4);
    const cervical = addPart(
        'cervical_vertebrae',
        'Cervical Vertebrae',
        cervicalGeo,
        0, 4.2, 0.5,
        'The neck bones formed a muscular S-shape to support the giant head.'
    );

    // 4. Ribcage
    const ribGeo = new THREE.SphereGeometry(1.2, 16, 16);
    ribGeo.scale(1, 1, 1.5);
    const ribcage = addPart(
        'ribcage',
        'Ribcage',
        ribGeo,
        0, 3.5, -1.5,
        'Barrel-like ribs protecting the heart and massive lungs of the dinosaur.'
    );

    // 5. Pelvis
    const pelvisGeo = new THREE.BoxGeometry(1.2, 1.2, 1);
    const pelvis = addPart(
        'pelvis',
        'Pelvis',
        pelvisGeo,
        0, 3.2, -3.5,
        'The hip structure that anchored the powerful hind legs and balanced the body.'
    );

    // 6. Femur (Thigh)
    const femurGeo = new THREE.CylinderGeometry(0.3, 0.2, 2, 8);
    const femur = addPart(
        'femur',
        'Femur',
        femurGeo,
        0, 1.5, -3.5,
        'The enormous thigh bone, one of the thickest bones, anchoring running muscles.'
    );

    // 7. Tibia (Shin)
    const tibiaGeo = new THREE.CylinderGeometry(0.2, 0.15, 1.8, 8);
    const tibia = addPart(
        'tibia',
        'Tibia',
        tibiaGeo,
        0, -0.3, -3.5,
        'The shin bone. T-Rex had slightly shorter tibias compared to other fast theropods.'
    );

    // 8. Metatarsals (Foot bones)
    const metaGeo = new THREE.BoxGeometry(0.4, 0.8, 0.6);
    const metatarsals = addPart(
        'metatarsals',
        'Metatarsals',
        metaGeo,
        0, -1.4, -3.3,
        'Long foot bones that allowed the T-Rex to walk on its toes like a modern bird.'
    );

    // 9. Tail Vertebrae
    const tailGeo = new THREE.ConeGeometry(0.6, 4, 8);
    tailGeo.rotateX(-Math.PI / 2);
    const tail = addPart(
        'tail_vertebrae',
        'Tail Vertebrae',
        tailGeo,
        0, 3.2, -4,
        'A stiff, extremely heavy tail used to balance the front half of the body.'
    );
    // Shift pivot for tail swaying animation
    tail.geometry.translate(0, 0, -2);
    tail.position.set(0, 3.2, -4);

    // 10. Forelimbs (Arms)
    const armGeo = new THREE.CylinderGeometry(0.1, 0.08, 1, 8);
    armGeo.rotateX(-Math.PI / 4);
    const forelimbs = addPart(
        'forelimbs',
        'Forelimbs',
        armGeo,
        0, 2.8, -0.5,
        'Tiny but highly muscled arms that ended in two clawed fingers.'
    );

    // Animation object
    const animation = {
        update: function(time) {
            // Jaw opening and closing based on sine wave
            mandible.rotation.x = Math.sin(time * 3) * 0.2 + 0.2; 
            // Tail swaying side to side
            tail.rotation.y = Math.sin(time * 1.5) * 0.15;
        }
    };

    // Quiz Questions
    const quiz = [
        {
            question: "Which part of the T-Rex skeleton forms the upper jaw and houses its massive, bone-crushing teeth?",
            options: ["Mandible", "Skull", "Pelvis", "Femur"],
            correctAnswer: "Skull",
            explanation: "The Skull forms the entire upper part of the head, housing the brain and the massive upper teeth."
        },
        {
            question: "What is the anatomical name for the lower jawbone of the T-Rex?",
            options: ["Skull", "Ribcage", "Mandible", "Tibia"],
            correctAnswer: "Mandible",
            explanation: "The Mandible is the lower jawbone, which was driven by incredibly strong muscles."
        },
        {
            question: "Which part of the skeleton acts as a counterbalance to the T-Rex's heavy head and torso?",
            options: ["Forelimbs", "Tail Vertebrae", "Ribcage", "Metatarsals"],
            correctAnswer: "Tail Vertebrae",
            explanation: "The long, heavy tail counterbalanced the massive front half, keeping the center of gravity over the hips."
        },
        {
            question: "What is the scientific term for the T-Rex's massive thigh bone?",
            options: ["Tibia", "Femur", "Cervical Vertebrae", "Pelvis"],
            correctAnswer: "Femur",
            explanation: "The Femur is the large upper leg bone that anchored huge muscles for moving."
        },
        {
            question: "The T-Rex is widely famous for having proportionally very small what?",
            options: ["Skull", "Forelimbs", "Teeth", "Tail Vertebrae"],
            correctAnswer: "Forelimbs",
            explanation: "Despite its massive overall size, the T-Rex had very short forelimbs (arms) with only two digits."
        },
        {
            question: "Which bones make up the shin area, connecting the knee to the ankle in the T-Rex?",
            options: ["Tibia", "Femur", "Metatarsals", "Cervical Vertebrae"],
            correctAnswer: "Tibia",
            explanation: "The Tibia connects the knee to the ankle, playing a crucial role in leg mechanics."
        }
    ];

    return { group, parts, animation, quiz };
}
