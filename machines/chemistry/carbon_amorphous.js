export const chem_c_amorphous = {
    id: 'chem_c_amorphous',
    name: 'Carbon - Amorphous',
    type: 'chemistry',
    category: 'Chemistry',
    price: 10000,
    description: 'Amorphous carbon, lacking long-range crystalline order. Found in coal and soot.',
    particles: '100 carbon atoms in a disordered network',
    connections: 'Random sp2 and sp3 covalent bonds',
    
    // Core Engine Integration
    init: function(engine) {
        this.engine = engine;
        this.particles = [];
        this.constraints = [];
        this.createStructure();
    },

    createStructure: function() {
        // Beautiful God Tier generation geometry
        const count = parseInt(this.particles.match(/\d+/)[0]) || 60;
        const radius = 60;
        
        for (let i = 0; i < count; i++) {
            // Advanced Fibonacci Sphere / Spiral Distribution
            const phi = Math.acos(1 - 2 * (i + 0.5) / count);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            
            const r = radius * (1 + 0.2 * Math.sin(theta * 3));
            
            const x = r * Math.sin(phi) * Math.cos(theta) + 400;
            const y = r * Math.sin(phi) * Math.sin(theta) + 300;
            
            const particle = this.engine.addParticle(x, y, {
                mass: 12.011,
                radius: 6,
                restitution: 0.8,
                friction: 0.1,
                color: '#3b3b3b',
                label: 'C',
                element: 'Carbon'
            });
            
            // Add subtle velocity for organic god-tier movement
            particle.vx = (Math.random() - 0.5) * 0.5;
            particle.vy = (Math.random() - 0.5) * 0.5;
            
            this.particles.push(particle);
        }
        
        // Advanced distance-based bonding
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                // Form bonds for nearby atoms to simulate crystal/chain structure
                if (dist < 40) {
                    const bond = this.engine.addConstraint(p1, p2, {
                        stiffness: 0.8,
                        damping: 0.1,
                        length: dist,
                        color: 'rgba(0, 200, 255, 0.4)',
                        width: 2
                    });
                    this.constraints.push(bond);
                }
            }
        }
    },
    
    update: function(dt) {
        // God tier ambient rotation and vibration
        const time = Date.now() * 0.001;
        const cx = 400, cy = 300;
        
        this.particles.forEach((p, i) => {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Centripetal force to maintain structure
            if (dist > 10) {
                p.vx -= (dx / dist) * 0.05;
                p.vy -= (dy / dist) * 0.05;
            }
            
            // Thermal vibration
            p.vx += Math.sin(time * 5 + i) * 0.1;
            p.vy += Math.cos(time * 5 + i) * 0.1;
        });
    },

    draw: function(ctx) {
        // Render ultra-high quality connections
        ctx.beginPath();
        this.constraints.forEach(c => {
            ctx.moveTo(c.p1.x, c.p1.y);
            ctx.lineTo(c.p2.x, c.p2.y);
        });
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Render atoms with premium God Tier glow
        this.particles.forEach(p => {
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
            gradient.addColorStop(0, '#555555');
            gradient.addColorStop(0.5, '#222222');
            gradient.addColorStop(1, '#000000');
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Highlight
            ctx.beginPath();
            ctx.arc(p.x - p.radius*0.3, p.y - p.radius*0.3, p.radius*0.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
            
            // Element Label
            ctx.fillStyle = '#00ffff';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.label, p.x, p.y);
        });
    }
};
