-- CDN FreelancerAPI Database Schema
-- SQL Server Database: CDN_FreelancerDB

-- Create Database (run this first)
-- CREATE DATABASE CDN_FreelancerDB;
-- USE CDN_FreelancerDB;

-- Create Freelancers table
CREATE TABLE Freelancers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20) NOT NULL,
    IsArchived BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Create Skillsets table
CREATE TABLE Skillsets (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FreelancerId INT NOT NULL,
    SkillName NVARCHAR(100) NOT NULL,
    FOREIGN KEY (FreelancerId) REFERENCES Freelancers(Id) ON DELETE CASCADE
);

-- Create Hobbies table
CREATE TABLE Hobbies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FreelancerId INT NOT NULL,
    HobbyName NVARCHAR(100) NOT NULL,
    FOREIGN KEY (FreelancerId) REFERENCES Freelancers(Id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IX_Freelancers_Username ON Freelancers(Username);
CREATE INDEX IX_Freelancers_Email ON Freelancers(Email);
CREATE INDEX IX_Skillsets_FreelancerId ON Skillsets(FreelancerId);
CREATE INDEX IX_Hobbies_FreelancerId ON Hobbies(FreelancerId);

-- Sample data (optional)
INSERT INTO Freelancers (Username, Email, Phone, IsArchived) VALUES
('john_doe', 'john.doe@example.com', '+1234567890', 0),
('jane_smith', 'jane.smith@example.com', '+0987654321', 0);

INSERT INTO Skillsets (FreelancerId, SkillName) VALUES
(1, 'C#'),
(1, 'JavaScript'),
(1, 'SQL Server'),
(2, 'Python'),
(2, 'React');

INSERT INTO Hobbies (FreelancerId, HobbyName) VALUES
(1, 'Reading'),
(1, 'Gaming'),
(2, 'Photography'),
(2, 'Hiking');