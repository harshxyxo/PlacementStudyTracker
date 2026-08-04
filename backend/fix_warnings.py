import os
import re

backend_dir = r'c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\backend\src\main\java\com\placementtracker\backend'

# 1. JwtAuthenticationFilter.java
jwt_file = os.path.join(backend_dir, 'security', 'JwtAuthenticationFilter.java')
with open(jwt_file, 'r', encoding='utf-8') as f:
    jwt_content = f.read()

if 'import org.springframework.lang.NonNull;' not in jwt_content:
    jwt_content = jwt_content.replace('import org.springframework.web.filter.OncePerRequestFilter;', 'import org.springframework.web.filter.OncePerRequestFilter;\nimport org.springframework.lang.NonNull;')

jwt_content = jwt_content.replace(
    'protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)',
    'protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)'
)
with open(jwt_file, 'w', encoding='utf-8') as f:
    f.write(jwt_content)

# 2. SecurityConfig.java
sec_file = os.path.join(backend_dir, 'security', 'SecurityConfig.java')
with open(sec_file, 'r', encoding='utf-8') as f:
    sec_content = f.read()

sec_content = re.sub(r'\s*private final CustomUserDetailsService customUserDetailsService;', '', sec_content)

with open(sec_file, 'w', encoding='utf-8') as f:
    f.write(sec_content)

# 3. MongoConfig.java
mongo_file = os.path.join(backend_dir, 'config', 'MongoConfig.java')
with open(mongo_file, 'r', encoding='utf-8') as f:
    mongo_content = f.read()

mongo_content = re.sub(r'\s*import org.springframework.context.annotation.Bean;', '', mongo_content)

with open(mongo_file, 'w', encoding='utf-8') as f:
    f.write(mongo_content)

# 4. DataSeeder.java
seeder_file = os.path.join(backend_dir, 'config', 'DataSeeder.java')
with open(seeder_file, 'r', encoding='utf-8') as f:
    seeder_content = f.read()

seeder_content = seeder_content.replace('Arrays.asList(', 'Arrays.<Problem>asList(')

with open(seeder_file, 'w', encoding='utf-8') as f:
    f.write(seeder_content)

# 5. ProblemService.java
prob_file = os.path.join(backend_dir, 'services', 'ProblemService.java')
with open(prob_file, 'r', encoding='utf-8') as f:
    prob_content = f.read()

prob_content = prob_content.replace('List.of()', 'List.<ProblemDTO>of()')
# Also suppress warnings on class just in case
if '@SuppressWarnings("unchecked")' not in prob_content:
    prob_content = prob_content.replace('public class ProblemService {', '@SuppressWarnings("unchecked")\npublic class ProblemService {')

with open(prob_file, 'w', encoding='utf-8') as f:
    f.write(prob_content)

print("Fixed Java backend warnings")
