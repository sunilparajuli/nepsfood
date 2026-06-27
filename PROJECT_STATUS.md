# Project Status: Food Safety App
*Last Updated: June 27, 2026*

This file serves as a memory bank to quickly resume work on the project in future sessions.

## Architecture Overview
- **Backend**: Laravel (SQLite Database)
- **Frontend**: React (Mantis UI)
- **Authentication**: JWT based (`tymon/jwt-auth`)
- **Routing**: API endpoints prefixed with `/forms/`

## Completed Features
1. **Dynamic Form Builder & Submissions**: 
   - Drag-and-drop form template creation (JSON schema).
   - Dynamic form filling and submission tracking.
   - PDF export of submissions.
2. **Roles & Granular Permissions**: 
   - Dynamic Roles management with nested JSON permissions per form template (Create, Read, Update, Delete).
3. **System Settings**: 
   - Configurable App Branding, SMTP, Theme Color, and Guidelines PDF (Stored in DB as Base64).
   - Dedicated Guidelines viewer with full-screen PDF support.
4. **Firebase Push Notifications**:
   - Real-time notification bell in the dashboard.
   - Dynamic Firebase configuration UI in the sidebar.
   - Backend dispatch to all administrators via FCM HTTP API upon new form submissions.

## Outstanding Tasks (Next Steps)
When returning to this project, you can pick up from any of the following tasks:
- [ ] **Backend Permissions Enforcement**: Implement middleware/policies to enforce the RBAC JSON permissions on the backend API routes (preventing unauthorized form access).
- [ ] **User Management**: Build the UI and backend logic to activate/deactivate users and assign them specific roles.
- [ ] **Search & Filters**: Add search filtering to form templates and autocomplete functionality when creating new submissions.
- [ ] **PDF Enhancements**: Integrate the "issue date" field explicitly into form structures and the generated PDF exports.

## How to Resume
Simply ask the agent to read this `PROJECT_STATUS.md` file to instantly regain context on where we left off!
