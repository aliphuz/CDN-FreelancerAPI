using CDN.FreelancerAPI.Application.DTOs;
using FluentValidation;

namespace CDN.FreelancerAPI.Application.Validators;

public class CreateFreelancerValidator : AbstractValidator<CreateFreelancerDto>
{
    public CreateFreelancerValidator()
    {
        RuleFor(x => x.Username).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(100);
        RuleFor(x => x.Phone).NotEmpty().MaximumLength(20);
    }
}