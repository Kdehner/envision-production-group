#!/bin/bash

# EPG Alias Setup Script
# Run this to automatically add EPG aliases to your zsh configuration

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 EPG Development Aliases Setup${NC}"
echo "=================================="

# Get current directory
CURRENT_DIR=$(pwd)
ZSHRC="$HOME/.zshrc"

echo -e "${YELLOW}📍 Current EPG project directory: $CURRENT_DIR${NC}"

# Check if .zshrc exists
if [[ ! -f "$ZSHRC" ]]; then
    echo -e "${RED}❌ .zshrc not found at $ZSHRC${NC}"
    echo "Creating new .zshrc file..."
    touch "$ZSHRC"
fi

# Backup existing .zshrc
echo -e "${BLUE}💾 Creating backup of .zshrc...${NC}"
cp "$ZSHRC" "$ZSHRC.backup.$(date +%Y%m%d-%H%M%S)"

# Check if EPG aliases already exist
if grep -q "EPG PROJECT ALIASES" "$ZSHRC"; then
    echo -e "${YELLOW}⚠️  EPG aliases already exist in .zshrc${NC}"
    read -p "Do you want to replace them? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Remove existing EPG aliases
        sed -i.bak '/# EPG PROJECT ALIASES/,/echo "🎉 EPG development aliases loaded!"/d' "$ZSHRC"
        echo -e "${GREEN}✅ Removed existing EPG aliases${NC}"
    else
        echo -e "${YELLOW}⏭️  Skipping alias installation${NC}"
        exit 0
    fi
fi

# Add EPG aliases to .zshrc
echo -e "${BLUE}📝 Adding EPG aliases to .zshrc...${NC}"

cat >> "$ZSHRC" << 'EOL'

# =============================================================================
# EPG PROJECT ALIASES
# =============================================================================

# Quick navigation to EPG project
EOL

# Add the project path dynamically
echo "alias epg='cd $CURRENT_DIR'" >> "$ZSHRC"
echo "alias epgc='cd $CURRENT_DIR/customer-website'" >> "$ZSHRC"
echo "alias epge='cd $CURRENT_DIR/employee-ops'" >> "$ZSHRC"
echo "alias epgs='cd $CURRENT_DIR/strapi-cms'" >> "$ZSHRC"

# Add the rest of the aliases from the artifact
cat >> "$ZSHRC" << 'EOL'

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
alias epgdbstatus='docker exec epg-postgres pg_isready -U $DB_USER -d $DB_NAME'

# =============================================================================
# WORKFLOW ALIASES
# =============================================================================

# Development session start
alias epgstart-dev='echo "🚀 Starting EPG Development Session..." && epg && epgup && epgstatus && echo "✅ Development environment ready!"'

# End of day cleanup
alias epgend='epgstopall && echo "💤 EPG development session ended. All services stopped."'

# Quick health check
alias epghealth='epgstatus && lsof -i :1337 -i :3000 -i :3001 -i :5432'

# Smart restart function
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

echo "🎉 EPG development aliases loaded!"
echo "💡 Type 'epghelp' to see available commands"
echo "🚀 Type 'epgstart-dev' to begin development session"
EOL

echo -e "${GREEN}✅ EPG aliases added to .zshrc${NC}"

# Make epg-control executable if it exists
if [[ -f "$CURRENT_DIR/epg-control" ]]; then
    chmod +x "$CURRENT_DIR/epg-control"
    echo -e "${GREEN}✅ Made epg-control executable${NC}"
fi

# Check for recommended tools
echo -e "${BLUE}🔧 Checking for recommended tools...${NC}"

tools=("bat" "exa" "fd" "tree")
missing_tools=()

for tool in "${tools[@]}"; do
    if ! command -v $tool &> /dev/null; then
        missing_tools+=($tool)
    else
        echo -e "${GREEN}✅ $tool installed${NC}"
    fi
done

if [[ ${#missing_tools[@]} -gt 0 ]]; then
    echo -e "${YELLOW}⚠️  Optional tools not installed: ${missing_tools[*]}${NC}"
    echo "Install them for enhanced experience:"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "  brew install ${missing_tools[*]}"
    elif command -v apt &> /dev/null; then
        echo "  sudo apt install ${missing_tools[*]}"
    else
        echo "  Check your package manager for: ${missing_tools[*]}"
    fi
fi

echo
echo -e "${GREEN}🎊 Setup complete!${NC}"
echo "📋 Next steps:"
echo "  1. Restart your terminal or run: source ~/.zshrc"
echo "  2. Navigate to your EPG project: epg"
echo "  3. Start development: epgstart-dev"
echo "  4. Check status: epgstatus"
echo
echo -e "${BLUE}📖 Quick Reference:${NC}"
echo "  epgup      - Start all services"
echo "  epgdown    - Stop all services" 
echo "  epgstatus  - Show status"
echo "  epghealth  - Health check"
echo "  epgstart-dev - Full development startup"
echo
echo -e "${YELLOW}💾 Backup created: $ZSHRC.backup.$(date +%Y%m%d-%H%M%S)${NC}"