using CDN.FreelancerAPI.Application.Interfaces;
using CDN.FreelancerAPI.Application.UseCases;
using CDN.FreelancerAPI.Application.Validators;
using CDN.FreelancerAPI.Infrastructure.Repositories;
using CDN.FreelancerAPI.WebAPI.Middleware;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<FreelancerService>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=DESKTOP-K234GO4\\SQLEXPRESS;Database=CDN_FreelancerDB;Trusted_Connection=True;TrustServerCertificate=True;";
builder.Services.AddScoped<IFreelancerRepository>(provider => new FreelancerRepository(connectionString));

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseCors("AllowReact");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();