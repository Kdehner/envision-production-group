# EPG Development Zsh Aliases
# Add this to your ~/.zshrc file

# =============================================================================
# EPG PROJECT ALIASES
# =============================================================================

# Quick navigation to EPG project
alias epg='cd /path/to/your/epg-project'  # Update this path!
alias epgc='cd /path/to/your/epg-project/customer-website'
alias epge='cd /path/to/your/epg-project/employee-ops'
alias epgs='cd /path/to/your/epg-project/strapi-cms'

# =============================================================================
# EPG CONTROL SCRIPT ALIASES
# =============================================================================

# Main control commands
alias epgctl='./epg-control'
alias epgstart='./epg-control start'
alias epgstop='./epg-control stop'
alias epgrestart='./epg-control restart'
alias epgstatus='./epg-control status'
alias epglogs='./epg-control logs'

# Environment switching
alias epgdev='./epg-control switch development'
alias epgprod='./epg-control switch production'

# =============================================================================
# SERVICE-SPECIFIC ALIASES
# =============================================================================

# Start individual services (development)
alias epgdb='./epg-control start database development'
alias epgstrapi='./epg-control start strapi development'
alias epgcustomer='./epg-control start customer development'
alias epgemployee='./epg-control start employee development'
alias epgall='./epg-control start all development'

# Stop individual services
alias epgdbstop='./epg-control stop database'
alias epgstrapistop='./epg-control stop strapi'
alias epgcustomerstop='./epg-control stop customer'
alias epgemployeestop='./epg-control stop employee'
alias epgstopall='./epg-control stop all'

# Restart individual services
alias epgdbrestart='./epg-control restart database'
alias epgstrapirestart='./epg-control restart strapi'
alias epgcustomerrestart='./epg-control restart customer'
alias epgemployeerestart='./epg-control restart employee'
alias epgrestartall='./epg-control restart all'

# =============================================================================
# LOG VIEWING ALIASES
# =============================================================================

# View logs
alias epglogdb='./epg-control logs database'
alias epglogstrapi='./epg-control logs strapi'
alias epglogcustomer='./epg-control logs customer'
alias epglogemployee='./epg-control logs employee'
alias epglogall='./epg-control logs all'

# Live log tailing with colors
alias epgtail='tail -f logs/*.log'
alias epgtailstrapi='tail -f logs/strapi.log | bat --paging=never -l log'
alias epgtailcustomer='tail -f logs/customer.log | bat --paging=never -l log'
alias epgtailemployee='tail -f logs/employee.log | bat --paging=never -l log'

# =============================================================================
# DEVELOPMENT WORKFLOW ALIASES
# =============================================================================

# Quick development startup sequence
alias epgup='./epg-control start all development && epgstatus'
alias epgdown='./epg-control stop all'
alias epgreload='./epg-control restart all development'

# Common development tasks
alias epgclean='rm -rf customer-website/node_modules employee-ops/node_modules strapi-cms/node_modules && rm -rf customer-website/.next employee-ops/.next'
alias epginstall='cd customer-website && npm install && cd ../employee-ops && npm install && cd ../strapi-cms && npm install && cd ..'
alias epgbuild='cd customer-website && npm run build && cd ../employee-ops && npm run build && cd ../strapi-cms && npm run build && cd ..'

# =============================================================================
# DATABASE ALIASES
# =============================================================================

# Database connection
alias epgpsql='docker exec -it epg-postgres psql -U $DB_USER -d $DB_NAME'
alias epgdbshell='docker exec -it epg-postgres bash'

# Database backup and restore
alias epgdump='docker exec epg-postgres pg_dump -U $DB_USER $DB_NAME > backup-$(date +%Y%m%d-%H%M%S).sql'
alias epgrestore='function _epgrestore() { docker exec -i epg-postgres psql -U $DB_USER $DB_NAME < $1; }; _epgrestore'

# Database status
alias epgdbstatus='docker exec epg-postgres pg_isready -U $DB_USER -d $DB_NAME'
alias epgdbsize='docker exec epg-postgres psql -U $DB_USER -d $DB_NAME -c "SELECT pg_size_pretty(pg_database_size(current_database()));"'

# =============================================================================
# DOCKER ALIASES (DATABASE ONLY)
# =============================================================================

# Docker container management
alias epgdps='docker ps --filter "name=epg-postgres"'
alias epgdlogs='docker logs -f epg-postgres'
alias epgdstats='docker stats epg-postgres'

# Docker cleanup
alias epgdclean='docker system prune -f && docker volume prune -f'
alias epgdreset='./epg-control stop database && docker rm epg-postgres && docker volume rm epg_postgres_data'

# =============================================================================
# GIT WORKFLOW ALIASES
# =============================================================================

# Git shortcuts for EPG project
alias epggit='git status'
alias epgadd='git add .'
alias epgcommit='function _epgcommit() { git commit -m "$1"; }; _epgcommit'
alias epgpush='git push origin main'
alias epgpull='git pull origin main'

# Branch management
alias epgbranch='git branch'
alias epgcheckout='function _epgcheckout() { git checkout $1; }; _epgcheckout'
alias epgnew='function _epgnew() { git checkout -b $1; }; _epgnew'

# Quick commit workflow
alias epgsave='git add . && git commit -m "WIP: Development checkpoint $(date)"'
alias epgquick='function _epgquick() { git add . && git commit -m "$1" && git push; }; _epgquick'

# =============================================================================
# NETWORK & PROCESS ALIASES
# =============================================================================

# Port checking
alias epgports='lsof -i :1337 -i :3000 -i :3001 -i :5432'
alias epgport1337='lsof -i :1337'  # Strapi
alias epgport3000='lsof -i :3000'  # Customer
alias epgport3001='lsof -i :3001'  # Employee
alias epgport5432='lsof -i :5432'  # Database

# Process management
alias epgps='ps aux | grep -E "(node|npm|strapi)" | grep -v grep'
alias epgkill='function _epgkill() { kill -9 $(lsof -t -i:$1); }; _epgkill'

# Network testing
alias epgping='ping localhost'
alias epgcurl='curl -I http://localhost'
alias epgtest='curl -I http://localhost:3000 && curl -I http://localhost:1337 && curl -I http://localhost:3001'

# =============================================================================
# FILE SYSTEM ALIASES
# =============================================================================

# Quick file operations
alias epgls='ls -la'
alias epgtree='tree -I node_modules'
alias epgsize='du -sh * | sort -hr'
alias epgfind='function _epgfind() { find . -name "*$1*" -not -path "*/node_modules/*"; }; _epgfind'

# Log file management
alias epgcleanlogs='rm -f logs/*.log'
alias epglogsize='du -sh logs/'
alias epgarchive='tar -czf epg-backup-$(date +%Y%m%d).tar.gz --exclude=node_modules --exclude=.git .'

# =============================================================================
# ENVIRONMENT & CONFIG ALIASES
# =============================================================================

# Environment file editing
alias epgenv='code .env.development'  # Use your preferred editor
alias epgenvprod='code .env.production'
alias epgconfig='code epg-control'

# Environment variable checking
alias epgcheck='echo "Environment: $NODE_ENV\nDatabase: $DB_NAME\nStrapi: $STRAPI_URL"'
alias epgvars='env | grep -E "(EPG|DB_|STRAPI|NEXT)" | sort'

# =============================================================================
# UTILITY ALIASES
# =============================================================================

# Quick utilities
alias epghelp='./epg-control help'
alias epgupdate='git pull && epginstall && epgbuild'
alias epgreset='epgstopall && epgclean && epginstall && epgup'

# System information
alias epginfo='echo "EPG Development Environment\n==========================\nNode: $(node --version)\nNPM: $(npm --version)\nDocker: $(docker --version | head -n1)\nGit: $(git --version)"'

# Quick access to common files
alias epgreadme='cat README.md'
alias epgpackage='cat package.json'
alias epgdocker='cat infrastructure/docker-compose.db.yml'

# =============================================================================
# ADVANCED WORKFLOW ALIASES
# =============================================================================

# Development session start
alias epgstart-dev='echo "🚀 Starting EPG Development Session..." && epg && epgup && epgstatus && echo "✅ Development environment ready!"'

# End of day cleanup
alias epgend='epgstopall && echo "💤 EPG development session ended. All services stopped."'

# Quick health check
alias epghealth='epgstatus && epgports && epgtest'

# Production deployment simulation
alias epgdeploy='epgstopall && epgbuild && epgprod && epgup && epgstatus'

# =============================================================================
# CONDITIONAL ALIASES (Require additional tools)
# =============================================================================

# If you have 'bat' installed for better syntax highlighting
if command -v bat &> /dev/null; then
    alias epgcat='function _epgcat() { bat $1; }; _epgcat'
    alias epglogcat='function _epglogcat() { bat logs/$1.log; }; _epglogcat'
fi

# If you have 'exa' installed for better ls
if command -v exa &> /dev/null; then
    alias epgls='exa -la --git'
    alias epgtree='exa --tree -I node_modules'
fi

# If you have 'fd' installed for better find
if command -v fd &> /dev/null; then
    alias epgfind='function _epgfind() { fd $1 --exclude node_modules; }; _epgfind'
fi

# =============================================================================
# COMPLETION FUNCTIONS
# =============================================================================

# Tab completion for EPG services
_epg_services=('database' 'strapi' 'customer' 'employee' 'all')
_epg_environments=('development' 'production')

compdef '_values "EPG services" $_epg_services' epgstart epgstop epgrestart
compdef '_values "EPG environments" $_epg_environments' epgdev epgprod

# =============================================================================
# FUNCTIONS FOR COMPLEX OPERATIONS
# =============================================================================

# Smart restart - only restart what's actually running
epgsmart() {
    echo "🔄 Smart restart - checking what's running..."
    if ./epg-control status | grep -q "✓ Database"; then
        echo "Database is running, keeping it up"
    else
        epgdb
    fi
    
    if ./epg-control status | grep -q "✓ Strapi"; then
        epgstrapirestart
    fi
    
    if ./epg-control status | grep -q "✓ Customer"; then
        epgcustomerrestart
    fi
    
    if ./epg-control status | grep -q "✓ Employee"; then
        epgemployeerestart
    fi
    
    epgstatus
}

# Watch logs from all services in parallel
epgwatch() {
    echo "👀 Watching all EPG logs..."
    # Open multiple terminal tabs/windows for log watching
    # This requires a terminal that supports opening new tabs
    if [[ "$TERM_PROGRAM" == "iTerm.app" ]] || [[ "$TERM_PROGRAM" == "Apple_Terminal" ]]; then
        osascript <<EOF
tell application "Terminal"
    do script "cd $(pwd) && epgtailstrapi"
    do script "cd $(pwd) && epgtailcustomer"
    do script "cd $(pwd) && epgtailemployee"
end tell
EOF
    else
        echo "Opening logs in background processes..."
        epgtailstrapi &
        epgtailcustomer &
        epgtailemployee &
        echo "Use 'jobs' to see running processes, 'fg' to bring to foreground"
    fi
}

# Development environment health check
epgdoctor() {
    echo "🩺 EPG Health Check"
    echo "=================="
    
    # Check if in correct directory
    if [[ ! -f "epg-control" ]]; then
        echo "❌ Not in EPG project directory"
        return 1
    fi
    
    # Check Node.js version
    local node_version=$(node --version)
    echo "Node.js: $node_version"
    
    # Check if dependencies are installed
    local missing_deps=0
    for dir in customer-website employee-ops strapi-cms; do
        if [[ -d "$dir" ]] && [[ ! -d "$dir/node_modules" ]]; then
            echo "❌ Missing node_modules in $dir"
            missing_deps=1
        fi
    done
    
    if [[ $missing_deps -eq 0 ]]; then
        echo "✅ All dependencies installed"
    fi
    
    # Check services status
    epgstatus
    
    # Check ports
    echo "\n🌐 Port Status:"
    epgports
    
    echo "\n💾 Database Connection:"
    epgdbstatus
    
    echo "\n📝 Recent Errors:"
    grep -i error logs/*.log 2>/dev/null | tail -5 || echo "No recent errors found"
}

# =============================================================================
# EXPORT FUNCTIONS
# =============================================================================

# Make functions available in subshells
export -f epgsmart epgwatch epgdoctor

echo "🎉 EPG development aliases loaded!"
echo "💡 Type 'epghelp' to see available commands"
echo "🩺 Type 'epgdoctor' to run health check"
echo "🚀 Type 'epgstart-dev' to begin development session"